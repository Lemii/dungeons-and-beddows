import { ReactElement, useState } from 'react';

import config from '../../config';
import { getIcon } from '../../icons';
import { Weapon } from '../../types';
import { sendNotification } from '../../utils/notifications';
import Loading from '../ui/Loading';
import PixelatedImage from '../ui/PixelatedImage';
import ItemCard from './ItemCard';

type Props = {
	weapon: Weapon;
	buttonCallback: () => void;
	disabled?: boolean;
	footer: ReactElement | ReactElement[];
	canAfford?: boolean;
};

const WeaponItem = ({ weapon, disabled, buttonCallback, footer, canAfford }: Props): ReactElement => {
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
		buttonCallback();
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
			<div className={`${disabled ? 'filter grayscale' : ''} transition-xl"`}>
				<div className="flex justify-center">
					<PixelatedImage src={getIcon(weapon.id)} alt={weapon.name} className="mb-4 w-1/2" />
				</div>
				<div className="">
					<h3 className="mb-4 text-center">{weapon.name}</h3>
					<div className="text-xxs">
						<div className="flex flex-between ">
							<div className="w-1/2">Effect:</div>
							<div className="w-1/2 text-right">+{weapon.attackRating} dmg</div>
						</div>
						{footer}
					</div>
				</div>
			</div>
		</ItemCard>
	);
};

export default WeaponItem;
