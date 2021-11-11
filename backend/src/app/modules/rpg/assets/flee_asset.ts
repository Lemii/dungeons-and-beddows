import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';

import { AssetId } from '../../../enums';
import { AccountProps } from '../../../types';
import * as helpers from '../../../utils/helpers';
import { getStoreData } from '../../../utils/store';
import * as validation from '../../../utils/validation';
import { CHAIN_STATE, ChainStateSchema } from '../schemas';

type FleeAssetProps = {
	dummy: string;
};

export class FleeAsset extends BaseAsset {
	public name = 'flee';
	public id = AssetId.Flee;

	public schema = {
		$id: 'rpg/flee-asset',
		title: 'FleeAsset transaction asset for rpg module',
		type: 'object',
		required: [],
		properties: {
			dummy: {
				dataType: 'string',
				fieldNumber: 1,
			},
		},
	};

	public async apply({ transaction, stateStore }: ApplyAssetContext<FleeAssetProps>): Promise<void> {
		// Prepare data
		const storeData = await getStoreData(stateStore);
		const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const emptyEntitySummary = helpers.getEmptyEntitySummary();

		// Validate data
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

		// Process flee
		const goldToSubtract = Math.round(player.rpg.gold * 0.3); // 30% penalty
		player.rpg.gold -= goldToSubtract;
		player.rpg.inBattleWith = emptyEntitySummary;
		player.rpg.timesFled += 1;

		monster.inBattleWith = emptyEntitySummary;
		monster.hp.current = monster.hp.max;

		// Update player in module store
		const index = storeData.players.findIndex(x => x.name === player.rpg.name);
		storeData.players[index] = player.rpg;

		await stateStore.account.set(player.address, player);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, storeData));
	}
}
