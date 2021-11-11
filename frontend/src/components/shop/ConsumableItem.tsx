import { ReactElement, useContext, useState } from 'react';

import config from '../../config';
import { PlayerContext } from '../../contexts/playerContext';
import { getIcon } from '../../icons';
import { Item, ItemEffect } from '../../types';
import { sendNotification } from '../../utils/notifications';
import { isAuthenticated } from '../../utils/validation';
import Loading from '../ui/Loading';
import PixelatedImage from '../ui/PixelatedImage';
import ItemCard from './ItemCard';

type Props = {
	consumable: Item;
	buttonCallback: () => void;
	disabled?: boolean;
	footer?: ReactElement | ReactElement[];
	canAfford?: boolean;
	nonInteractive?: boolean;
};

const getEffectDescription = (effect: ItemEffect, amount: number) => {
	if (effect === 'hpUp') {
		return `+${amount} hp`;
	}
	if (effect === 'mpUp') {
		return `+${amount} mp`;
	}
	if (effect === 'xpUp') {
		return `+${amount} xp`;
	}

	return 'None';
};

const Consumable = ({
	consumable,
	disabled,
	buttonCallback,
	footer,
	canAfford,
	nonInteractive,
}: Props): ReactElement => {
	const [loading, setLoading] = useState(false);
	const context = useContext(PlayerContext);

	const handleOnClick = () => {
		if (!isAuthenticated(context)) {
			sendNotification('info', 'Oops!', 'You are not signed in.');
			return;
		}

		if (nonInteractive) {
			return;
		}

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
		<ItemCard onClick={handleOnClick} nonInteractive={nonInteractive}>
			<div className={`${disabled && 'filter grayscale'} ${nonInteractive && 'transition-xl'}`}>
				<div className="flex justify-center">
					<PixelatedImage src={getIcon(consumable.id)} alt={consumable.name} className="mb-4 w-1/2" />
				</div>

				<h4 className="mb-4 text-center">{consumable.name}</h4>
				<div className="text-xxs">
					<div className="flex flex-between">
						<div className="w-1/2">Effect:</div>
						<div className="w-1/2 text-right">{getEffectDescription(consumable.effect, consumable.amount)}</div>
					</div>
					{footer}
				</div>
			</div>
		</ItemCard>
	);
};

export default Consumable;
