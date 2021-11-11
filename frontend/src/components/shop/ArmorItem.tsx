import { ReactElement, useState } from 'react';

import config from '../../config';
import { AssetId } from '../../enums';
import { getIcon } from '../../icons';
import { Armor } from '../../types';
import { sendNotification } from '../../utils/notifications';
import Loading from '../ui/Loading';
import PixelatedImage from '../ui/PixelatedImage';
import ItemCard from './ItemCard';

type Props = {
	armor: Armor;
	buttonCallback: (id: string, assetId: AssetId) => void;
	disabled?: boolean;
	footer: ReactElement | ReactElement[];
	canAfford?: boolean;
};

const ArmorItem = ({ armor, disabled, buttonCallback, footer, canAfford }: Props): ReactElement => {
	const [loading, setLoading] = useState(false);

	const handleOnClick = () => {
		if (disabled) {
			sendNotification('info', 'Hold up!', 'Please wait for the action to be completed.');
			return;
		}

		if (canAfford !== undefined && !canAfford) {
			sendNotification('info', 'Oops!', 'You do not have enough gold.');
			return;
		}

		setLoading(true);
		buttonCallback(armor.id, AssetId.PurchaseGear);
		setTimeout(() => {
			setLoading(false);
		}, config.blockTime);
	};

	if (loading) {
		return (
			<ItemCard>
				<Loading scale={50} />
			</ItemCard>
		);
	}

	return (
		<ItemCard onClick={handleOnClick}>
			<div className={`${disabled ? 'filter grayscale' : ''} transition-xl text-green"`}>
				<div className="flex justify-center">
					<PixelatedImage src={getIcon(armor.id)} alt={armor.name} className="mb-8 w-1/2" />
				</div>
				<div className="">
					<h3 className="mb-4 text-center">{armor.name}</h3>
					<div className="text-xxs">
						<div className="flex flex-between ">
							<div className="w-1/2">Effect:</div>
							<div className="w-1/2 text-right">+{armor.defenseRating} def</div>
						</div>
						{footer}
					</div>
				</div>
			</div>
		</ItemCard>
	);
};

export default ArmorItem;
