// To do
import { ApplyAssetContext, BaseAsset } from 'lisk-sdk';

import { AssetId } from '../../../enums';

export class UseSkillAsset extends BaseAsset {
	public name = 'useSkill';
	public id = AssetId.UseSkill;

	// Define schema for asset
	public schema = {
		$id: 'rpg/useSkill-asset',
		title: 'UseSkillAsset transaction asset for rpg module',
		type: 'object',
		required: [],
		properties: {},
	};

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "useSkill" apply hook is not implemented.');
	}
}
