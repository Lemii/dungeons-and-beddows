import { MouseEventHandler, ReactElement, useCallback } from 'react';

import { getIcon } from '../../icons';
import { getFromLocalStorage } from '../../utils/storage';
import PixelatedImage from '../ui/PixelatedImage';

type Props = {
	type: 'attack' | 'defend' | 'item' | 'skill' | 'flee';
	onClick: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
};

const BattleButton = ({ type, onClick, disabled }: Props): ReactElement => {
	const hideLabel = useCallback(() => getFromLocalStorage<boolean>('hideButtonLabels') || false, []);

	return (
		<button className="btn btn-primary" onClick={onClick} disabled={disabled}>
			<PixelatedImage src={getIcon(type)} alt={`${type} button`} className="w-16 h-16" />
			{!hideLabel() && <p className="mt-1">{type}</p>}
		</button>
	);
};

export default BattleButton;
