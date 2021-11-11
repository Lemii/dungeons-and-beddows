import _ from 'lodash';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';

import { ActionType } from '../../enums';
import * as api from '../../services/api';
import { Player, SortingOrder } from '../../types';
import * as storage from '../../utils/storage';
import Hr from '../ui/Hr';
import Table from './Table';

const sortingOptions: { label: string; value: string; order: SortingOrder }[] = [
	{
		label: 'Level',
		value: 'lvl',
		order: 'desc',
	},
	{
		label: 'Gold',
		value: 'gold',
		order: 'desc',
	},
	{
		label: 'Enemies Defeated',
		value: 'entitiesDefeated',
		order: 'desc',
	},
];

type SortingOption = typeof sortingOptions[number];

const SORTING_INIT = sortingOptions[0];

const Leaderboards = (): ReactElement => {
	const [players, setPlayers] = useState<Player[]>([]);
	const [sorting, setSorting] = useState<SortingOption>(
		storage.getFromLocalStorage('leaderboardsSort') || SORTING_INIT,
	);

	useEffect(() => {
		const updatePlayers = async () => {
			const data = await api.invokeAction<Player[]>(ActionType.GetPlayers, undefined, undefined, 0);
			const sorted = sorting ? _.orderBy(data, [sorting.value], [sorting.order]) : data;
			setPlayers(sorted);
		};

		updatePlayers();
	}, [sorting]);

	const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		const selectedOption = sortingOptions.find(o => o.label === value);

		if (selectedOption) {
			storage.setToLocalStorage(selectedOption, 'leaderboardsSort');
			setSorting(selectedOption);
		}
	};

	return (
		<div>
			<h1 className="text-center text-4xl">The Greatest Adventures of All Time</h1>

			<Hr mt={8} mb={8} />

			<div className="mb-12 flex justify-center">
				<div>
					<span className="mr-4">Sort by:</span>{' '}
					<select value={sorting.label} onChange={handleSortChange} name="sorting" id="sorting">
						{sortingOptions.map(o => (
							<option key={o.label} value={o.label}>
								{o.label}
							</option>
						))}
					</select>
				</div>
			</div>

			<Table data={players} />
		</div>
	);
};

export default Leaderboards;
