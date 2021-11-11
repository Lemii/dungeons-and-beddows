import { ReactElement, useContext } from 'react';
import { Link } from 'react-router-dom';

import { PlayerContext } from '../../contexts/playerContext';
import { getIcon } from '../../icons';
import { calcRequiredXp } from '../../utils/helpers';
import * as validation from '../../utils/validation';
import PixelatedImage from './PixelatedImage';
import ProgressBar from './ProgressBar';

const StatSummary = (): ReactElement => {
	const context = useContext(PlayerContext);

	if (!context.playerAccount?.rpg) {
		return (
			<div className="h-28 flex">
				<p className="m-auto">
					Stats unavailable. <Link to="/sign-in">Sign in</Link>.
				</p>
			</div>
		);
	}

	const player = context.playerAccount.rpg;

	return (
		<div>
			<div className="flex justify-between whitespace-nowrap overflow-x-hidden">
				<h2>
					{player.name} {!validation.isAlive(player) && '💀'}
				</h2>
				<h3>lvl {player.lvl}</h3>
			</div>

			<ProgressBar currentValue={player.hp.current} maxValue={player.hp.max} unit="hp" color="red" />
			<ProgressBar currentValue={player.mp.current} maxValue={player.mp.max} unit="mp" color="blue" />
			<ProgressBar currentValue={player.xp} maxValue={calcRequiredXp(player.xp)} unit="xp" color="green" />

			<div className="flex justify-between mt-2">
				<div>
					<PixelatedImage src={getIcon('gold')} alt="gold" className="inline-block w-6" /> {player.gold}
				</div>
				<div className="">
					<Link to="/my-profile">Go to profile</Link>
				</div>
			</div>
		</div>
	);
};

export default StatSummary;
