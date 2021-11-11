import {
    AfterBlockApplyContext,
    AfterGenesisBlockApplyContext,
    BaseModule,
    codec,
    cryptography,
    TransactionApplyContext,
} from 'lisk-sdk';
import * as _ from 'lodash';

import { STATE_STORE_INIT } from '../../defaults';
import { AssetId } from '../../enums';
import * as items from '../../items';
import { AccountProps, Monster } from '../../types';
import * as helpers from '../../utils/helpers';
import { generateMonster } from '../../utils/monsters';
import { getModuleData, getStoreData } from '../../utils/store';
import * as validation from '../../utils/validation';
import { AttackAsset } from './assets/attack_asset';
import { DefendAsset } from './assets/defend_asset';
import { EngageMonsterAsset } from './assets/engage_monster_asset';
import { FleeAsset } from './assets/flee_asset';
import { PurchaseConsumableAsset } from './assets/purchase_consumable_asset';
import { PurchaseGearAsset } from './assets/purchase_gear_asset';
import { RegisterPlayerAsset } from './assets/register_player_asset';
import { SellItemAsset } from './assets/sell_item_asset';
import { UseItemAsset } from './assets/use_item_asset';
import { UseSkillAsset } from './assets/use_skill_asset';
import { accountSchema, CHAIN_STATE, ChainStateSchema } from './schemas';

/*
 * LiskHQ/lisk-commander
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
/* eslint-disable class-methods-use-this */

export class RpgModule extends BaseModule {
	// @ts-ignore
	public actions = {
		getState: async () => getModuleData(this._dataAccess),
		getMonsters: async () => (await getModuleData(this._dataAccess)).monsters,
		getAfterlife: async () => (await getModuleData(this._dataAccess)).afterlife,
		getPlayers: async () => (await getModuleData(this._dataAccess)).players,
		getStatistics: async () => (await getModuleData(this._dataAccess)).statistics,
		getPlayerNames: async () => {
			const data = await getModuleData(this._dataAccess);
			return data.players.map(p => p.name);
		},
		getMonsterById: async (params: { id: string }) => {
			const data = await getModuleData(this._dataAccess);
			return data.monsters.find(m => m.id === params.id) ?? data.afterlife.find(m => m.id === params.id);
		},
		getMonstersByIds: async (params: { ids: string[] }) => {
			const monsters: Monster[] = [];
			const data = await getModuleData(this._dataAccess);

			[...data.monsters, ...data.afterlife].forEach(monster => {
				if (params.ids.includes(monster.id)) {
					monsters.push(monster);
				}
			});

			return monsters;
		},
		getItems: () => items,
	};

	public reducers = {};
	public name = 'rpg';
	public transactionAssets = [
		new EngageMonsterAsset(),
		new AttackAsset(),
		new PurchaseConsumableAsset(),
		new PurchaseGearAsset(),
		new DefendAsset(),
		new UseSkillAsset(),
		new UseItemAsset(),
		new FleeAsset(),
		new AttackAsset(),
		new SellItemAsset(),
		new RegisterPlayerAsset(),
	];
	public events = [
		'playerRegistered',
		'monsterSpawned',
		'waveSpawned',
		'monsterEngaged',
		'monsterDefeated',
		'playerDefeated',
		'playerLeveled',
		'playerFled',
	];
	public id = 1000;
	public accountSchema = accountSchema;

	// Used to keep track of player levels, required to publish 'DING' events
	private playersBuffer: { [key: string]: AccountProps | undefined } = {};

	public async beforeTransactionApply({ stateStore, transaction }: TransactionApplyContext) {
		// Set player data when performing rpg action
		if (transaction.moduleID === this.id) {
			const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
			const playerBinaryAddress = cryptography.bufferToHex(player.address);
			this.playersBuffer[playerBinaryAddress] = player;
		}
	}

	public async afterBlockApply({ stateStore, block }: AfterBlockApplyContext) {
		const storeData = await getStoreData(stateStore);
		const numOfMonsters = helpers.getNumOfMonsters(storeData.monsters);

		let intensity = '';

		// Randomly spawn monsters after N number of blocks
		if (block.header.height % 42 === 0 && numOfMonsters.extreme < 100) {
			intensity = 'extreme';
		}

		if (!intensity && block.header.height % 29 === 0 && numOfMonsters.hard < 150) {
			intensity = 'hard';
		}

		if (!intensity && block.header.height % 16 === 0 && numOfMonsters.normal < 200) {
			intensity = 'normal';
		}
		if (!intensity && block.header.height % 10 === 0 && numOfMonsters.easy < 250) {
			intensity = 'easy';
		}

		if (block.header.height === 1) {
			intensity = 'easy';
		}

		if (!intensity) {
			return;
		}

		const blockId = block.header.id.toString('hex');
		const seeds = helpers.chunkSubstr(blockId); // Use the block id to generate multiple 'random' seeds
		const monsters: Monster[] = [];

		const getLevel = (i: number) => {
			if (intensity === 'extreme') {
				return i + 17;
			}

			if (intensity === 'hard') {
				return i + 9;
			}

			if (intensity === 'normal') {
				return i + 1;
			}

			return i < 4 ? 1 : 2;
		};

		seeds.forEach((s, i) => {
			const level = getLevel(i);
			const monster = generateMonster(level, s);
			monsters.push(monster);
		});

		storeData.monsters = [...monsters, ...storeData.monsters];
		storeData.statistics.monstersAlive += seeds.length;

		await stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, storeData));
		this._channel.publish('rpg:waveSpawned', { intensity, eventId: blockId });
	}

	public async afterTransactionApply({ transaction, stateStore }: TransactionApplyContext) {
		const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const playerBinaryAddress = cryptography.bufferToHex(player.address);
		const playerPrevState = this.playersBuffer[playerBinaryAddress];
		const transactionId = transaction.id.toString('hex');

		// REGISTER LOGIC
		if (transaction.moduleID === this.id && transaction.assetID === AssetId.Register) {
			this._channel.publish('rpg:playerRegistered', {
				name: player.rpg.name,
				eventId: `${transactionId}_${AssetId.Register}`,
			});
		}

		// MONSTER SPAWN LOGIC
		if (transaction.moduleID === this.id && transaction.assetID === AssetId.SpawnMonster) {
			const data = await getStoreData(stateStore);
			const monster = _.last(data.monsters);
			this._channel.publish('rpg:monsterSpawned', { monster, eventId: `${transactionId}_${AssetId.SpawnMonster}` });
		}

		// WAVE SPAWN LOGIC
		if (transaction.moduleID === this.id && transaction.assetID === AssetId.SpawnWave) {
			this._channel.publish('rpg:waveSpawned', { intensity: '', eventId: `${transactionId}_${AssetId.SpawnWave}` });
		}

		// MONSTER ENGAGE LOGIC
		if (transaction.moduleID === this.id && transaction.assetID === AssetId.Engage) {
			this._channel.publish('rpg:monsterEngaged', {
				player: player.rpg.name,
				monster: player.rpg.inBattleWith.name,
				eventId: `${transactionId}_${AssetId.Engage}`,
			});
		}

		// ATTACK LOGIC
		if (transaction.moduleID === this.id && transaction.assetID === AssetId.Attack) {
			if (playerPrevState && player.rpg.lvl > playerPrevState.rpg.lvl) {
				this._channel.publish('rpg:playerLeveled', { player: player.rpg, eventId: `${transactionId}_playerLeveled` });
			}

			if (!validation.isAlive(player.rpg)) {
				this._channel.publish('rpg:playerDefeated', {
					player: player.rpg.name,
					monster: player.rpg.defeatedBy.name,
					eventId: `${transactionId}_playerDefeated`,
				});
			}

			// Monster entity gets removed from player's inBattleWith property when it dies
			if (validation.isAlive(player.rpg) && !validation.isInBattle(player.rpg)) {
				this._channel.publish('rpg:monsterDefeated', {
					player: player.rpg.name,
					monster: _.last(player.rpg.entitiesDefeated)?.name,
					eventId: `${transactionId}_monsterDefeated`,
				});
			}
		}

		// FLEE LOGIC
		if (transaction.moduleID === this.id && transaction.assetID === AssetId.Flee) {
			if (playerPrevState && player.rpg.inBattleWith.name !== playerPrevState.rpg.inBattleWith.name) {
				const goldLost = playerPrevState.rpg.gold - player.rpg.gold;

				this._channel.publish('rpg:playerFled', {
					player: player.rpg.name,
					monster: playerPrevState.rpg.inBattleWith.name,
					goldLost,
					eventId: `${transactionId}_playerFled`,
				});
			}
		}

		// Clean up player buffer
		this.playersBuffer[playerBinaryAddress] = undefined;
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, STATE_STORE_INIT));
	}
}
