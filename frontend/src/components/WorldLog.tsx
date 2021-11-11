import _ from 'lodash';
import { useEffect, useState } from 'react';

import tome from '../assets/misc/tome_t0_17x17.png';
import { EventType } from '../enums';
import * as api from '../services/api';
import {
    FleeEventReturnData,
    GenericEventReturnData,
    LevelUpEventReturnData,
    MonsterSpawnEventReturnData,
    RegisterEventReturnData,
    WaveSpawnEventReturnData,
} from '../types';

type LogEntry = {
	message: string;
	eventId: string;
	type:
		| 'monsterSpawn'
		| 'waveSpawn'
		| 'playerDefeated'
		| 'monsterEngage'
		| 'monsterDefeat'
		| 'ding'
		| 'registration'
		| 'flee'
		| 'generic';
};

const WorldLog = () => {
	const [log, setLog] = useState<LogEntry[]>([{ message: 'Entering game world..', eventId: 'init', type: 'generic' }]);

	useEffect(() => {
		const initConsole = async () => {
			const client = await api.getClient();

			api.subscribeToEvent(registerEventHandler, EventType.Registered, client);
			api.subscribeToEvent(monsterSpawnEventHandler, EventType.MonsterSpawned, client);
			api.subscribeToEvent(waveSpawnEventHandler, EventType.WaveSpawned, client);
			api.subscribeToEvent(engageEventHandler, EventType.Engaged, client);
			api.subscribeToEvent(monsterDefeatedEventHandler, EventType.MonsterDefeat, client);
			api.subscribeToEvent(playerDefeatedEventHandler, EventType.PlayerDefeat, client);
			api.subscribeToEvent(dingEventHandler, EventType.Ding, client);
			api.subscribeToEvent(fleeEventHandler, EventType.Flee, client);
		};

		initConsole();
	}, []);

	const registerEventHandler = ({ name, eventId }: RegisterEventReturnData) => {
		const logEntry: LogEntry = {
			message: `Player ${name} is now registered to the game world.`,
			eventId: '',
			type: 'registration',
		};
		setLog(prev => [logEntry, ...prev]);
	};

	const monsterSpawnEventHandler = ({ name, lvl, eventId }: MonsterSpawnEventReturnData) => {
		const logEntry: LogEntry = { message: `${name} (lvl ${lvl}) has just spawned!`, eventId, type: 'monsterSpawn' };
		setLog(prev => [logEntry, ...prev]);
	};

	const waveSpawnEventHandler = ({ intensity, eventId }: WaveSpawnEventReturnData) => {
		const logEntry: LogEntry = {
			message: `A WAVE OF ${intensity.toUpperCase()} ENEMIES just spawned!`,
			eventId,
			type: 'waveSpawn',
		};
		setLog(prev => [logEntry, ...prev]);
	};

	const engageEventHandler = ({ player, monster, eventId }: GenericEventReturnData) => {
		const logEntry: LogEntry = {
			message: `Player ${player} decides to fight ${monster}!`,
			eventId,
			type: 'monsterEngage',
		};
		setLog(prev => [logEntry, ...prev]);
	};

	const playerDefeatedEventHandler = ({ player, monster, eventId }: GenericEventReturnData) => {
		const logEntry: LogEntry = {
			message: `Player ${player} has been killed by ${monster}.`,
			eventId,
			type: 'playerDefeated',
		};
		setLog(prev => [logEntry, ...prev]);
	};

	const monsterDefeatedEventHandler = ({ player, monster, eventId }: GenericEventReturnData) => {
		const logEntry: LogEntry = {
			message: `Player ${player} has just slain the terrible ${monster}!`,
			eventId,
			type: 'monsterDefeat',
		};
		setLog(prev => [logEntry, ...prev]);
	};

	const dingEventHandler = ({ player, eventId }: LevelUpEventReturnData) => {
		const logEntry: LogEntry = {
			message: `DING!!1 Player ${player.name} has just reached level ${player.lvl}!`,
			eventId,
			type: 'ding',
		};
		setLog(prev => [logEntry, ...prev]);
	};

	const fleeEventHandler = ({ monster, player, goldLost, eventId }: FleeEventReturnData) => {
		const logEntry: LogEntry = {
			message: `Player ${player} flees the battle with ${monster} and loses ${goldLost}g!`,
			eventId,
			type: 'flee',
		};
		setLog(prev => [logEntry, ...prev]);
	};

	const renderLogEntries = () => {
		const map: { [key: string]: { icon: string; color: string } } = {
			registration: { icon: '👤', color: '' },
			monsterEngage: { icon: '⚔️', color: '' },
			monsterSpawn: { icon: '👾', color: 'text-gray-400' },
			waveSpawn: { icon: '👾', color: 'text-gray-400' },
			playerDefeated: { icon: '☠️', color: 'text-red-500' },
			monsterDefeat: { icon: '💥', color: 'text-green-500' },
			ding: { icon: '🥇', color: 'text-yellow-500' },
			flee: { icon: '🐤', color: 'text-pink-500' },
			fallback: { icon: 'ℹ️', color: '' },
		};

		// Dirty workaround for duplicate event bug
		const uniqueEntries = _.uniqBy(log, 'eventId');

		return uniqueEntries.map((l, i) => {
			const key = `logEntry-${i}`;
			const id = i === log.length - 1 ? 'last' : 'not-last';

			return (
				<div key={key} id={id} className={`mb-1 ${map[l.type]?.color || 'text-gray-200'} `}>
					<span className="mr-3">{map[l.type]?.icon || 'ℹ️'}</span> {l.message}
				</div>
			);
		});
	};

	return (
		<div className="overflow-y-hidden world-log-height">
			<h2 className="text-center">
				<img src={tome} className="inline-icon pixelated" alt="tome icon" /> World Log{' '}
				<img src={tome} className="inline-icon pixelated" alt="tome icon" />
			</h2>

			<hr className="divide-y divide-indigo-500 mt-2 mb-8" />

			<div className="text-xs ">{renderLogEntries()}</div>
		</div>
	);
};

export default WorldLog;
