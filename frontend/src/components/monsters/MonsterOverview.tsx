import _ from 'lodash';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import config from '../../config';
import { PlayerContext } from '../../contexts/playerContext';
import { ActionType, AssetId, EventType } from '../../enums';
import * as api from '../../services/api';
import * as transactions from '../../services/transactions';
import { Monster, MonsterSpawnEventReturnData, SortingOrder } from '../../types';
import { sendNotification } from '../../utils/notifications';
import * as storage from '../../utils/storage';
import * as validation from '../../utils/validation';
import Empty from '../ui/Empty';
import Hr from '../ui/Hr';
import PreferenceCheckbox from '../ui/PreferenceCheckbox';
import MonsterCard from './MonsterCard';
import MonsterTable from './MonsterTable';

const sortingOptions: { label: string; value: string; order: SortingOrder }[] = [
	{
		label: 'Level (ascending)',
		value: 'lvl',
		order: 'asc',
	},
	{
		label: 'Level (descending)',
		value: 'lvl',
		order: 'desc',
	},
	{
		label: 'Name (ascending)',
		value: 'name',
		order: 'asc',
	},
	{
		label: 'Name (descending)',
		value: 'name',
		order: 'desc',
	},
	{
		label: 'Players defeated (ascending)',
		value: 'entitiesDefeated',
		order: 'asc',
	},
	{
		label: 'Players defeated  (descending)',
		value: 'entitiesDefeated',
		order: 'desc',
	},
];

export type MonsterSortingOption = typeof sortingOptions[number] | null;

const viewOptions = ['cards', 'table'];
type ViewOption = typeof viewOptions[number];

type Props = {
	afterlife?: boolean;
};

const SORTING_INIT = sortingOptions[0];

const MonsterOverview = ({ afterlife = false }: Props) => {
	const [monsters, setMonsters] = useState<Monster[]>([]);
	const [hideLowLvlMonsters, setHideLowLvlMonsters] = useState(storage.getFromLocalStorage('hideLowLevel') || true);
	const [limitResults, setLimitResults] = useState(true);
	const [sorting, setSorting] = useState<MonsterSortingOption>(
		afterlife ? storage.getFromLocalStorage('afterlifeSort') || null : storage.getFromLocalStorage('huntSort') || null,
	);
	const [view, setView] = useState<ViewOption>(
		afterlife
			? storage.getFromLocalStorage('afterlifeView') || 'table'
			: storage.getFromLocalStorage('huntView') || 'cards',
	);

	const history = useHistory();
	const context = useContext(PlayerContext);

	const sortingRef = useRef<MonsterSortingOption | null>(null);

	useEffect(() => {
		getMonsters();
		api.subscribeToEvent(spawnEventHandler, EventType.WaveSpawned);
		api.subscribeToEvent(spawnEventHandler, EventType.MonsterSpawned);
	}, []);

	useEffect(() => {
		sortingRef.current = sorting;
		getMonsters();
	}, [sorting, hideLowLvlMonsters]);

	const getMonsters = async () => {
		const sort = sortingRef.current;

		const data = afterlife
			? await api.invokeAction<Monster[]>(ActionType.GetAfterlife, undefined, undefined, 0)
			: await api.invokeAction<Monster[]>(ActionType.GetMonsters, undefined, undefined, 0);

		const filteredData =
			hideLowLvlMonsters && context.playerAccount
				? data.filter(m => validation.isInLevelRange(m, context.playerAccount!.rpg))
				: data;

		const sorted = sort ? _.orderBy(filteredData, [sort.value], [sort.order]) : filteredData;

		if (afterlife) {
			sorted.reverse();
		}
		setMonsters(sorted);
	};

	const spawnEventHandler = (data: MonsterSpawnEventReturnData) => {
		getMonsters();
	};

	const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;

		if (e.target.name === 'view') {
			setView(value);
			storage.setToLocalStorage(value, afterlife ? 'afterlifeView' : 'huntView');
			return;
		}

		if (e.target.name === 'sort') {
			if (!value) {
				setSorting(SORTING_INIT);
				return;
			}

			const selectedOption = sortingOptions.find(o => o.label === value);

			if (selectedOption) {
				setSorting(selectedOption);
				storage.setToLocalStorage(selectedOption, afterlife ? 'afterlifeSort' : 'huntSort');
			}
		}
	};

	const handleEngageMonster = async (id: string) => {
		if (!context.playerCredentials) {
			throw Error('No credentials found');
		}

		try {
			await transactions.sendGenericTransaction(context.playerCredentials.passphrase, AssetId.Engage, {
				monsterId: id,
			});

			setTimeout(() => {
				history.push('/battle');
			}, config.blockTime);
		} catch (e) {
			const error = e as Error;
			sendNotification('error', 'Oops!', error.message);
		}
	};

	if (_.isEmpty(monsters)) {
		return <Empty text={afterlife ? 'No monsters have been slain yet...' : 'No monsters have spawned yet...'} />;
	}

	const isLoggedIn = !!context.playerAccount && !!context.playerCredentials;

	return (
		<div className="h-full">
			<h1 className="text-center text-4xl">
				{afterlife ? 'Foul Beasts, Rotting in Hell' : 'Monsters roaming around the world'}
			</h1>

			<Hr mt={8} mb={8} />

			<div className="flex justify-center">
				<div className="mr-16">
					<span className="mr-4">View:</span>{' '}
					<select value={view} onChange={handleSortChange} name="view" id="view">
						{viewOptions.map(v => (
							<option key={v} value={v}>
								{v}
							</option>
						))}
					</select>
				</div>

				<div>
					<span className="mr-4">Sort by:</span>{' '}
					<select value={sorting?.label || undefined} onChange={handleSortChange} name="sort" id="sort">
						<option value={undefined}>None</option>
						{sortingOptions.map(o => (
							<option key={o.label} value={o.label}>
								{o.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{!afterlife ? (
				<div className="mb-12 mt-4 flex">
					<div className="m-auto">
						<PreferenceCheckbox
							value={hideLowLvlMonsters}
							storageKey="hideLowLevel"
							text="Hide incompatible monsters"
							cb={() => setHideLowLvlMonsters(!hideLowLvlMonsters)}
						/>
					</div>
				</div>
			) : (
				<div className="mb-12" />
			)}

			{view === 'table' && (
				<MonsterTable
					monsters={monsters.slice(0, limitResults ? 24 : monsters.length)}
					afterlife={afterlife}
					handleEngageMonster={handleEngageMonster}
					isLoggedIn={isLoggedIn}
				/>
			)}
			{view === 'cards' && (
				<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
					{monsters.slice(0, limitResults ? 24 : monsters.length).map(monster => (
						<MonsterCard key={monster.id} monster={monster} handleEngageMonster={handleEngageMonster} />
					))}
				</div>
			)}

			{monsters.length > 24 && (
				<div className="flex mt-8" onClick={() => setLimitResults(!limitResults)}>
					<button className="m-auto animate-pulse text-yellow-300">{limitResults ? 'Show all' : 'Show less'}</button>
				</div>
			)}
		</div>
	);
};

export default MonsterOverview;
