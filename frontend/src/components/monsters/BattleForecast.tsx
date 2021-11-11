import { ReactElement } from 'react';

import { Monster } from '../../types';
import { calculatePotentialRewards, getDamageRange } from '../../utils/helpers';
import Tooltip from '../ui/Tooltip';

type Props = {
	children: ReactElement | ReactElement[];
	monster: Monster;
};

const BattleForecast = ({ children, monster }: Props): ReactElement => {
	const { gold, xp } = calculatePotentialRewards(monster);

	return (
		<Tooltip
			tooltip={
				<div className="text-left">
					<h4 className="uppercase">Stats</h4>
					<div className="flex flex-col text-xs  ml-4">
						<div>Hp: {monster.hp.max}</div>
						<div>Def: {monster.def}</div>
						<div>Dmg: {getDamageRange(monster.dmg, 'monster')}</div>
						<div className="mb-2">Def: {monster.def}</div>
					</div>

					<h4 className="uppercase">Rewards</h4>
					<div className="flex flex-col text-xs  ml-4">
						<div>
							Xp: {xp.min}-{xp.max}
						</div>
						<div>
							Gold: {gold.min}-{gold.max}
						</div>
					</div>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default BattleForecast;
