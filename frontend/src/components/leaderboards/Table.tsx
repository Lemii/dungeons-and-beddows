import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { Player } from '../../types';

type Props = {
	data: Player[];
};

const Table = ({ data }: Props): ReactElement => {
	const renderNumber = (num: number) => num.toLocaleString();
	const renderLink = (player: Player) => <Link to={`/profile/${player.id}`}>{player.name}</Link>;
	const isEven = (n: number) => n % 2 === 0;

	return (
		<table className="w-full table-fixed ">
			<thead>
				<tr className="bg-gray-800">
					<th className="w-16">Rank</th>
					<th className="w-48">Name</th>
					<th className="w-16">Lvl</th>
					<th className="w-16">XP</th>
					<th className="w-16">Gold</th>
					<th className="w-32">Monsters defeated</th>
					<th className="w-32">Status</th>
				</tr>
			</thead>
			<tbody>
				{data.map((p, i) => (
					<tr key={p.name} className={`text-left ${isEven(i) ? 'bg-gray-500' : 'bg-gray-450'} h-12`}>
						<td>{i + 1}</td>
						<td className="text-left">{renderLink(p)}</td>
						<td>{renderNumber(p.lvl)}</td>
						<td>{renderNumber(p.xp)}</td>
						<td>{renderNumber(p.gold)}</td>
						<td>{renderNumber(p.entitiesDefeated.length)}</td>
						<td>
							{p.status.type === 'alive' ? (
								<span className="text-green-400">Alive</span>
							) : (
								<span className="text-red-400">Deceased</span>
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Table;
