import { useContext, useState } from 'react';

import config from '../../config';
import { PlayerContext } from '../../contexts/playerContext';
import { Monster } from '../../types';
import { getMonsterAvatar } from '../../utils/avatars';
import { sendNotification } from '../../utils/notifications';
import * as validation from '../../utils/validation';
import Loading from '../ui/Loading';
import PixelatedImage from '../ui/PixelatedImage';
import BattleForecast from './BattleForecast';

type Props = {
	monster: Monster;
	handleEngageMonster: (id: string) => void;
};

export const MonsterCard = ({ monster, handleEngageMonster }: Props) => {
	const [loading, setLoading] = useState(false);
	const context = useContext(PlayerContext);

	const engage = async () => {
		setLoading(true);

		try {
			handleEngageMonster(monster.id);
			setTimeout(() => {
				setLoading(false);
			}, config.blockTime);
		} catch (e) {
			setLoading(false);
			const error = e as Error;
			sendNotification('error', 'Oops!', error.message);
		}
	};

	const renderStatus = () => {
		if (validation.isInBattle(monster)) {
			return <p className="text-red-300">In battle with {monster.inBattleWith.name}</p>;
		}

		if (!validation.isAlive(monster)) {
			return <p className="text-black">No longer with us 💀</p>;
		}

		return <p className="text-gray-300">Roaming around..</p>;
	};

	if (loading) {
		return <Loading />;
	}

	const disabled = !context.playerAccount || !validation.isAlive(monster) || validation.isInBattle(monster);

	return (
		<div className="custom-rounded-sm bg-gray-500 text-center">
			<div className="flex justify-center">
				<PixelatedImage
					src={getMonsterAvatar(monster.id)}
					alt="Monster Avatar"
					className={`mb-2 w-3/4 ${!validation.isAlive(monster) && 'filter grayscale'}`}
				/>
			</div>

			<BattleForecast monster={monster}>
				<div>
					<div className="font-bold">{monster.name.toUpperCase()}</div>
					<div className="text-xxs mb-4">
						<div> Level: {monster.lvl}</div>
					</div>
				</div>
			</BattleForecast>

			<div className="text-xxs">{renderStatus()}</div>

			<button className="btn btn-danger text-1xl mt-4" onClick={engage} disabled={disabled}>
				Fight!
			</button>
		</div>
	);
};

export default MonsterCard;
