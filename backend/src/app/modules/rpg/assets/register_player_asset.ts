import { ApplyAssetContext, BaseAsset, codec, cryptography, ValidateAssetContext } from 'lisk-sdk';

import { AssetId } from '../../../enums';
import { AccountProps } from '../../../types';
import { getStoreData } from '../../../utils/store';
import { CHAIN_STATE, ChainStateSchema } from '../schemas';

type RegisterPlayerAssetProps = {
	name: string;
};

export class RegisterPlayerAsset extends BaseAsset {
	public name = 'registerPlayer';
	public id = AssetId.Register;

	public schema = {
		$id: 'rpg/registerPlayer-asset',
		title: 'RegisterPlayerAsset transaction asset for rpg module',
		type: 'object',
		required: ['name'],
		properties: {
			name: {
				fieldNumber: 1,
				dataType: 'string',
			},
		},
	};

	public validate({ asset }: ValidateAssetContext<RegisterPlayerAssetProps>): void {
		const regex = /^[A-Za-z]{3,16}$/;

		if (!regex.exec(asset.name)) {
			throw new Error('Invalid name');
		}
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<RegisterPlayerAssetProps>): Promise<void> {
		const storeData = await getStoreData(stateStore);
		const existingNames = storeData.players.map(p => p.name);

		if (existingNames.includes(asset.name)) {
			throw new Error('Name already exists');
		}

		const player = await stateStore.account.getOrDefault<AccountProps>(transaction.senderAddress);
		player.rpg.id = cryptography.bufferToHex(player.address);
		player.rpg.status = {
			type: 'alive',
			statusUpdated: 0, // To do: add ts to tx asset and use here
		};
		player.rpg.name = asset.name;

		// Update player in module store
		storeData.players.push(player.rpg);
		storeData.statistics.playersAlive += 1;

		await stateStore.account.set(player.address, player);
		await stateStore.chain.set(CHAIN_STATE, codec.encode(ChainStateSchema, storeData));
	}
}
