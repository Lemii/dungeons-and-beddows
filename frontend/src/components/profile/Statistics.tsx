import { ReactElement } from 'react';

import { ShopItems } from '../../hooks/useShopItems';
import { Player } from '../../types';
import { getPlayerAvatar } from '../../utils/avatars';
import { calcRequiredXp } from '../../utils/helpers';
import { getGearAttack, getGearDefense } from '../../utils/stats';
import * as validation from '../../utils/validation';
import PixelatedImage from '../ui/PixelatedImage';
import ProgressBar from '../ui/ProgressBar';

type Props = {
	player: Player;
	items: ShopItems;
};

const Statistics = ({ player, items }: Props): ReactElement => {
	return (
		<div className="bg-gray-700 custom-rounded-sm h-full">
			<div className="flex justify-start mb-4">
				<div className="border-2 border-white rounded-xl h-24 w-24 mr-8 p-4">
					<PixelatedImage src={getPlayerAvatar(player.name)} alt="Player Avatar" className="w-full opacity-75" />
				</div>
				<div className="my-auto whitespace-nowrap overflow-x-hidden">
					<h1 className="mb-2">{player.name}</h1>

					<p>Status: {validation.isAlive(player) ? "Alive 'n kicking" : 'Deceased'}</p>
				</div>
			</div>
			<ProgressBar currentValue={player.hp.current} maxValue={player.hp.max} unit="hp" color="red" />
			<ProgressBar currentValue={player.mp.current} maxValue={player.mp.max} unit="mp" color="blue" />
			<ProgressBar currentValue={player.xp} maxValue={calcRequiredXp(player.xp)} unit="xp" color="green" />

			<div className="flex justify-between gap-8 mt-8">
				<div className="">Level:</div>
				<div className="text-right">{player.lvl}</div>
			</div>
			<div className="flex justify-between gap-8">
				<div className="">Gold:</div>
				<div className="text-right">{player.gold}</div>
			</div>

			<div className="flex justify-between gap-8">
				<div className="">Base dmg:</div>
				<div className="text-right">{player.dmg}</div>
			</div>
			<div className="flex justify-between gap-8 mb-4">
				<div className="">Base def:</div>
				<div className="text-right">{player.def}</div>
			</div>
			<div className="flex justify-between gap-8">
				<div className="">Total dmg:</div>
				<div className="text-right">{player.dmg + getGearAttack(player, items)}</div>
			</div>
			<div className="flex justify-between gap-8">
				<div className="">Total def:</div>
				<div className="text-right">{player.def + getGearDefense(player, items)}</div>
			</div>
			<div className="flex justify-between gap-8 mt-4">
				<div className="">Total damage dealt:</div>
				<div className="text-right">{player.totalDamageDealt}</div>
			</div>
			<div className="flex justify-between gap-8">
				<div className="">Total damage taken:</div>
				<div className="text-right">{player.totalDamageTaken}</div>
			</div>
			<div className="flex justify-between gap-8 mb-4">
				<div className="">Times fled:</div>
				<div className="text-right">{player.timesFled}</div>
			</div>
		</div>
	);
};

export default Statistics;
