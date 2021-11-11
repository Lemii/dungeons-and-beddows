import { ApplyAssetContext, BaseAsset, codec, cryptography, ValidateAssetContext, validator } from 'lisk-sdk';

import { maxLevelDifference } from '../../../defaults';
import { AssetId } from '../../../enums';
import { AccountProps } from '../../../types';
import { buildEntitySummary } from '../../../utils/helpers';
import { getStoreData } from '../../../utils/store';
import * as validation from '../../../utils/validation';
import { CHAIN_STATE, ChainStateSchema } from '../schemas';

export type EngageMonsterProps = {
	monsterId: string;
};

export class EngageMonsterAsset extends BaseAsset {
	public name = 'engageMonster';
	public id = AssetId.Engage;

	public schema = {
		$id: 'rpg/engageMonster-asset',
		title: 'EngageMonsterAsset transaction asset for rpg module',
		type: 'object',
		required: ['monsterId'],
		properties: {
			monsterId: {
				dataType: 'string',
				fieldNumber: 1,
			},
		},
	};

	public validate({ asset }: ValidateAssetContext<EngageMonsterProps>): void {
		if (!validator.isHexString(asset.monsterId)) {
			throw new Error(`Invalid monsterId defined on transaction.`);
		}
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<EngageMonsterProps>): Promise<void> {
		// Prepare data
		const storeData = await getStoreData(stateStore);
		const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const playerBinaryAddress = cryptography.bufferToHex(player.address);

		// Validate data
		if (!validation.isRegistered(player.rpg)) {
			throw new Error('User is not registered as player.');
		}

		if (!validation.isAlive(player.rpg)) {
			throw new Error('Player is not dead.');
		}

		if (validation.isInBattle(player.rpg)) {
			throw new Error(`Sender is already battling with ${player.rpg.inBattleWith.name}`);
		}

		const monster = storeData.monsters.find(m => m.id === asset.monsterId);

		if (!monster) {
			throw new Error(`Monster with id ${asset.monsterId} does not exist.`);
		}

		if (!validation.isAlive(monster)) {
			throw new Error(`Monster with id ${asset.monsterId} is already defeated.`);
		}

		if (validation.isInBattle(monster)) {
			throw new Error(`Monster is already battling with ${monster.inBattleWith.id}`);
		}

		if (!validation.isInLevelRange(monster, player.rpg)) {
			throw new Error(`Monster is too low level for player (max diff: ${maxLevelDifference}).`);
		}

		// Process engage monster
		player.rpg.inBattleWith = buildEntitySummary(monster.name, monster.id);
		monster.inBattleWith = buildEntitySummary(player.rpg.name, playerBinaryAddress);

		// Update player in module store
		const index = storeData.players.findIndex(x => x.name === player.rpg.name);
		storeData.players[index] = player.rpg;

		await stateStore.account.set(player.address, player);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, storeData));
	}
}
