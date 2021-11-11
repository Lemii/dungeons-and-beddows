import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import { AssetId } from '../../../enums';
import { armor, weapons } from '../../../items';
import { AccountProps } from '../../../types';
import { getStoreData } from '../../../utils/store';
import * as validation from '../../../utils/validation';
import { CHAIN_STATE, ChainStateSchema } from '../schemas';

type PurchaseGearAssetProps = {
	id: string;
};

export class PurchaseGearAsset extends BaseAsset {
	public name = 'PurchaseGear';
	public id = AssetId.PurchaseGear;

	public schema = {
		$id: 'rpg/PurchaseGear-asset',
		title: 'PurchaseGearAsset transaction asset for rpg module',
		type: 'object',
		required: ['id'],
		properties: {
			id: {
				fieldNumber: 1,
				dataType: 'string',
			},
		},
	};

	public validate({ asset }: ValidateAssetContext<PurchaseGearAssetProps>): void {
		const availableIds = [...weapons.map(c => c.id), ...armor.map(c => c.id)];

		if (!availableIds.includes(asset.id)) {
			throw new Error(`Gear with id ${asset.id} does not exist.`);
		}
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<PurchaseGearAssetProps>): Promise<void> {
		// eslint-disable-next-line
		const item = [...weapons, ...armor].find(i => i.id === asset.id)!;
		const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		const storeData = await getStoreData(stateStore);

		if (validation.isInBattle(player.rpg)) {
			throw new Error(`You can not use the shop while in battle.`);
		}

		if (item.value > player.rpg.gold) {
			throw new Error(`Player does not have enough gold to purchase gear.`);
		}

		player.rpg.gold -= item.value;
		player.rpg.gear[item.type] = asset.id;

		// Update player in module store
		const index = storeData.players.findIndex(x => x.name === player.rpg.name);
		storeData.players[index] = player.rpg;

		await stateStore.account.set(player.address, player);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, storeData));
	}
}
