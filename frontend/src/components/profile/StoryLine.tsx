import { ReactElement, useCallback, useEffect, useState } from 'react';

import { ActionType } from '../../enums';
import * as api from '../../services/api';
import { Monster, Player } from '../../types';
import { getMonsterAvatar } from '../../utils/avatars';
import { isAlive } from '../../utils/validation';
import Empty from '../ui/Empty';
import Loading from '../ui/Loading';
import PixelatedImage from '../ui/PixelatedImage';

type EventType = 'playerDefeat' | 'monsterDefeat' | 'flee';

type MonsterMap = { [key: string]: Monster & { eventType: EventType } };

type Props = {
	player: Player;
};

const Story = ({ monster, eventType }: { monster: Monster; eventType: EventType }) => {
	const eventMap: { [key: string]: { className: string; text: string } } = {
		monsterDefeat: { className: 'border-green-200 bg-gray-500', text: 'Slain Monster' },
		playerDefeat: { className: 'border-red-200 bg-red-700', text: 'Killed By' },
	};

	if (!monster) {
		return <Loading />;
	}

	return (
		<div
			className={`inline-block w-48 custom-rounded-sm border-2 ${
				eventMap[eventType].className || 'border-gray-200 bg-gray-500'
			}`}
		>
			<div className="flex justify-center">
				<PixelatedImage src={getMonsterAvatar(monster.id)} alt="Monster Avatar" className="w-8 h-8 inline-block mr-4" />
				<div>
					<div>{monster.name}</div>

					<div className="text-xxs text-center">Lvl {monster.lvl}</div>
				</div>
			</div>

			<p className="text-center mt-3">{eventMap[eventType].text}</p>
		</div>
	);
};

const GreaterThan = () => <div className="h-full my-auto mx-2">&gt;</div>;

const StoryLine = ({ player }: Props): ReactElement => {
	const [monsterMap, setMonsterMap] = useState<MonsterMap>({});

	useEffect(() => {
		const fetchMonsters = async () => {
			const map: MonsterMap = {};
			const entitiesDefeated = await api.invokeAction<Monster[]>(ActionType.GetMonstersByIds, {
				ids: player.entitiesDefeated.map(e => e.id),
			});
			entitiesDefeated.forEach(m => {
				map[m.id] = { ...m, eventType: 'monsterDefeat' };
			});

			if (!isAlive(player)) {
				const defeatedBy = await api.invokeAction<Monster>(ActionType.GetMonsterById, {
					id: player.defeatedBy.id,
				});

				map[defeatedBy.id] = { ...defeatedBy, eventType: 'playerDefeat' };
			}
			setMonsterMap(map);
		};

		fetchMonsters();
	}, []);

	const summaries = useCallback(() => {
		const getMonsterSummaries = () => {
			const data = [...player.entitiesDefeated];

			if (!isAlive(player)) {
				data.push(player.defeatedBy);
			}

			return data;
		};

		return getMonsterSummaries();
	}, [player]);

	if (!summaries().length) {
		return <Empty />;
	}

	return (
		<div className="flex flex-wrap gap-8 mb-12">
			{summaries().map((monster, i) => (
				<>
					<Story monster={monsterMap[monster.id]} eventType={monsterMap[monster.id]?.eventType} />{' '}
					{summaries().length - 1 !== i && <GreaterThan />}
				</>
			))}
		</div>
	);
};

export default StoryLine;
