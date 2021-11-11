// To do
import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

import { AssetId } from '../../../enums';

export class SellItemAsset extends BaseAsset {
	public name = 'sellItem';
	public id = AssetId.SellItem;

	// Define schema for asset
	public schema = {
		$id: 'rpg/sellItem-asset',
		title: 'SellItemAsset transaction asset for rpg module',
		type: 'object',
		required: [],
		properties: {},
	};

	public validate({ asset }: ValidateAssetContext<{}>): void {
		// Validate your asset
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "sellItem" apply hook is not implemented.');
	}
}
