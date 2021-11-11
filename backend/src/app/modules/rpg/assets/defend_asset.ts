import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';

import { AssetId } from '../../../enums';
import { AccountProps } from '../../../types';
import * as battle from '../../../utils/battle';
import { getStoreData } from '../../../utils/store';
import * as validation from '../../../utils/validation';
import { CHAIN_STATE, ChainStateSchema } from '../schemas';

type DefendAssetProps = {
	dummy: string;
};

export class DefendAsset extends BaseAsset {
	public name = 'defend';
	public id = AssetId.Defend;

	public schema = {
		$id: 'rpg/defend-asset',
		title: 'DefendAsset transaction asset for rpg module',
		type: 'object',
		required: [],
		properties: {
			dummy: {
				dataType: 'string',
				fieldNumber: 1,
			},
		},
	};

	public async apply({ transaction, stateStore }: ApplyAssetContext<DefendAssetProps>): Promise<void> {
		// Prepare data
		const storeData = await getStoreData(stateStore);
		const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);

		// Validate data
		if (!validation.isRegistered(player.rpg)) {
			throw new Error('User is not registered as player.');
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

		// Process defend action
		battle.processBattleMove(player, monster, 'defending', transaction.id.toString('hex'), storeData);

		// Update player in module store
		const index = storeData.players.findIndex(x => x.name === player.rpg.name);
		storeData.players[index] = player.rpg;

		await stateStore.account.set(player.address, player);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, storeData));
	}
}
