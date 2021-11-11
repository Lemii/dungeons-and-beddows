import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import config from '../../config';
import { Monster } from '../../types';
import { getMonsterAvatar } from '../../utils/avatars';
import { sendNotification } from '../../utils/notifications';
import Loading from '../ui/Loading';
import PixelatedImage from '../ui/PixelatedImage';
import BattleForecast from './BattleForecast';

type TableRowProps = {
	monster: Monster;
	index: number;
	handleEngageMonster: (id: string) => void;
	afterlife?: boolean;
	isLoggedIn: boolean;
};

const TableRow = ({ monster, index, afterlife, handleEngageMonster, isLoggedIn }: TableRowProps) => {
	const [loading, setLoading] = useState(false);

	const renderNumber = (num: number) => num.toLocaleString();
	const isEven = (n: number) => n % 2 === 0;

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

	return (
		<tr className={`text-left ${isEven(index) ? 'bg-gray-500' : 'bg-gray-450'}`}>
			<td className="text-left">
				<PixelatedImage
					src={getMonsterAvatar(monster.id)}
					alt="Monster Avatar"
					className="w-8 inline-block mr-6 mb-1"
				/>
				<BattleForecast monster={monster}>
					<div className="cursor-pointer text-yellow-300 animate-pulse">{monster.name}</div>
				</BattleForecast>
			</td>
			<td className="">lvl {renderNumber(monster.lvl)}</td>
			<td className="">{renderNumber(monster.entitiesDefeated.length)}</td>
			<td className="">
				{monster.status.type === 'alive' ? (
					<span className="text-green-400">Alive</span>
				) : (
					<span className="text-red-400">Deceased</span>
				)}
			</td>

			{!afterlife ? (
				<td>
					{!isLoggedIn && !loading && <span className="text-xxs text-gray-300">Not Logged In</span>}

					{isLoggedIn && loading && <Loading scale={40} />}

					{isLoggedIn && !loading && (
						<button className="btn btn-danger text-1xl" onClick={engage} disabled={!!monster.inBattleWith.id}>
							Fight!
						</button>
					)}
				</td>
			) : (
				<td className="text-center">
					<Link to={`/profile/${monster.defeatedBy.id}`}>{monster.defeatedBy.name}</Link>
				</td>
			)}
		</tr>
	);
};

type Props = {
	monsters: Monster[];
	afterlife?: boolean;
	handleEngageMonster: (id: string) => void;
	isLoggedIn: boolean;
};

const MonsterTable = ({ monsters, afterlife, handleEngageMonster, isLoggedIn }: Props): ReactElement => {
	return (
		<table className="w-full table-fixed">
			<thead>
				<tr className="bg-gray-800">
					<th className="">Monster</th>
					<th className="w-32 ">Level</th>
					<th className="w-32 ">Players defeated</th>
					<th className="w-32 ">Status</th>

					{!afterlife ? <th className="w-32 ">Fight</th> : <th className="">Slain By</th>}
				</tr>
			</thead>
			<tbody>
				{monsters.map((m, i) => (
					<TableRow
						key={`${m.id}-${m.name}-${i}`}
						monster={m}
						index={i}
						handleEngageMonster={handleEngageMonster}
						isLoggedIn={isLoggedIn}
						afterlife={afterlife}
					/>
				))}
			</tbody>
		</table>
	);
};

export default MonsterTable;
