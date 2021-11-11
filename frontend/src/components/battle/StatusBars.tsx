import { ReactElement } from 'react';

import { Monster, Player } from '../../types';
import ProgressBar from '../ui/ProgressBar';

type Props = {
	entity: Player | Monster;
	hideXpBar?: boolean;
};

const StatusBars = ({ entity, hideXpBar }: Props): ReactElement => {
	return (
		<div className="w-full">
			<div className="flex justify-between">
				<h3 className="uppercase">{entity.name}</h3>
				<h3 className="uppercase">Lvl {entity.lvl}</h3>
			</div>
			<ProgressBar currentValue={entity.hp.current} maxValue={entity.hp.max} unit="hp" color="red" />
			<ProgressBar currentValue={entity.mp.current} maxValue={entity.mp.max} unit="mp" color="blue" />
		</div>
	);
};

export default StatusBars;
