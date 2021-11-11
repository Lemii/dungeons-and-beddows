import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';

import { AssetId } from '../../../enums';
import { AccountProps } from '../../../types';
import * as battle from '../../../utils/battle';
import { getStoreData } from '../../../utils/store';
import * as validation from '../../../utils/validation';
import { CHAIN_STATE, ChainStateSchema } from '../schemas';

type AttackAssetProps = {
	dummy: string;
};

export class AttackAsset extends BaseAsset {
	public name = 'attack';
	public id = AssetId.Attack;

	public schema = {
		$id: 'rpg/attack-asset',
		title: 'AttackAsset transaction asset for rpg module',
		type: 'object',
		required: [],
		properties: {
			dummy: {
				dataType: 'string',
				fieldNumber: 1,
			},
		},
	};

	public async apply({ transaction, stateStore }: ApplyAssetContext<AttackAssetProps>): Promise<void> {
		// Prepare data
		const storeData = await getStoreData(stateStore);
		const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);

		// Validate data
		if (!validation.isRegistered(player.rpg)) {
			throw new Error('User is not registered as player.');
		}

		if (!validation.isAlive(player.rpg)) {
			throw new Error('Player is not dead.');
		}

		if (!validation.isInBattle(player.rpg)) {
			throw new Error(`Player is not battling any monster.`);
		}

		const monster = storeData.monsters.find(m => m.id === player.rpg.inBattleWith.id);

		if (!monster) {
			throw new Error(`Monster with id ${player.rpg.inBattleWith.id} does not exist.`);
		}

		if (!validation.isAlive(monster)) {
			throw new Error(`Monster with id ${player.rpg.inBattleWith.id} is already defeated.`);
		}

		if (!validation.isInBattle(monster)) {
			throw new Error(`Monster is not in battle with any player.`);
		}

		// Process attack action
		battle.processBattleMove(player, monster, 'attacking', transaction.id.toString('hex'), storeData);

		// Update player in module store
		const index = storeData.players.findIndex(x => x.name === player.rpg.name);
		storeData.players[index] = player.rpg;

		await stateStore.account.set(player.address, player);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, storeData));
	}
}
