import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import { AssetId } from '../../../enums';
import { consumables } from '../../../items';
import { AccountProps } from '../../../types';
import { getStoreData } from '../../../utils/store';
import * as validation from '../../../utils/validation';
import { CHAIN_STATE, ChainStateSchema } from '../schemas';

type PurchaseConsumableAssetProps = {
	id: string;
};

export class PurchaseConsumableAsset extends BaseAsset {
	public name = 'PurchaseConsumable';
	public id = AssetId.PurchaseConsumable;

	public schema = {
		$id: 'rpg/PurchaseConsumable-asset',
		title: 'PurchaseConsumableAsset transaction asset for rpg module',
		type: 'object',
		required: ['id'],
		properties: {
			id: {
				fieldNumber: 1,
				dataType: 'string',
			},
		},
	};

	public validate({ asset }: ValidateAssetContext<PurchaseConsumableAssetProps>): void {
		const availableIds = consumables.map(c => c.id);

		if (!availableIds.includes(asset.id)) {
			throw new Error(`Consumable with id ${asset.id} does not exist.`);
		}
	}

	public async apply({
		asset,
		transaction,
		stateStore,
	}: ApplyAssetContext<PurchaseConsumableAssetProps>): Promise<void> {
		// eslint-disable-next-line
		const item = consumables.find(i => i.id === asset.id)!;
		const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const storeData = await getStoreData(stateStore);

		if (validation.isInBattle(player.rpg)) {
			throw new Error(`You can not use the shop while in battle.`);
		}

		if (player.rpg.items.length >= 4) {
			throw new Error(`You have reached the maximum amount of consumables.`);
		}

		if (item.value > player.rpg.gold) {
			throw new Error(`Player does not have enough gold to purchase item.`);
		}

		player.rpg.gold -= item.value;
		player.rpg.items.push({ itemId: item.id, purchaseId: transaction.id.toString('hex') });

		// Update player in module store
		const index = storeData.players.findIndex(x => x.name === player.rpg.name);
		storeData.players[index] = player.rpg;

		await stateStore.account.set(player.address, player);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, storeData));
	}
}
