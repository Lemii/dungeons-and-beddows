import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';

import { AssetId } from '../../../enums';
import { consumables } from '../../../items';
import { AccountProps } from '../../../types';
import { processBattleMove } from '../../../utils/battle';
import { getStoreData } from '../../../utils/store';
import * as validation from '../../../utils/validation';
import { CHAIN_STATE, ChainStateSchema } from '../schemas';

type UseItemAssetProps = {
	purchaseId: string;
};

export class UseItemAsset extends BaseAsset {
	public name = 'useItem';
	public id = AssetId.UseItem;

	public schema = {
		$id: 'rpg/useItem-asset',
		title: 'UseItemAsset transaction asset for rpg module',
		type: 'object',
		required: ['purchaseId'],
		properties: {
			purchaseId: {
				fieldNumber: 1,
				dataType: 'string',
			},
		},
	};

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<UseItemAssetProps>): Promise<void> {
		const storeData = await getStoreData(stateStore);
		const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const item = player.rpg.items.find(i => i.purchaseId === asset.purchaseId);

		if (!item) {
			throw new Error(`Player does not own item with purchase id ${asset.purchaseId}`);
		}

		const consumable = consumables.find(c => c.id === item.itemId);

		if (!consumable) {
			throw new Error(`Item with id ${item.itemId} does not exist`);
		}

		if (consumable.effect === 'hpUp') {
			const updatedHp = player.rpg.hp.current + consumable.amount;
			player.rpg.hp.current = updatedHp > player.rpg.hp.max ? player.rpg.hp.max : updatedHp;
		}

		if (consumable.effect === 'mpUp') {
			const updatedMp = player.rpg.mp.current + consumable.amount;
			player.rpg.mp.current = updatedMp > player.rpg.mp.max ? player.rpg.mp.max : updatedMp;
		}

		if (consumable.effect === 'xpUp') {
			// To do
		}

		if (validation.isInBattle(player.rpg)) {
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
			processBattleMove(player, monster, 'useItem', transaction.id.toString('hex'), storeData);
		}

		// Update player in module store
		const index = storeData.players.findIndex(x => x.name === player.rpg.name);
		storeData.players[index] = player.rpg;

		player.rpg.items = player.rpg.items.filter(i => i.purchaseId !== asset.purchaseId);
		await stateStore.account.set(player.address, player);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, storeData));
	}
}
