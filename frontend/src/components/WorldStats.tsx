import { ReactElement, useEffect, useState } from 'react';

import config from '../config';
import { ActionType, EventType } from '../enums';
import * as api from '../services/api';
import { Statistics } from '../types';

const WorldStatsCard = (): ReactElement => {
	const [stats, setStats] = useState<Statistics | null>(null);
	const [isConnected, setIsConnected] = useState(true);

	useEffect(() => {
		const fetchWorldStats = async () => {
			const data = await api.invokeAction<Statistics>(ActionType.GetStatistics);
			setStats(data);
		};

		fetchWorldStats();
		api.subscribeToEvent(fetchWorldStats, EventType.newBlock);
	}, []);

	useEffect(() => {
		const isConnected = async () => {
			try {
				await api.clientCache.node.getNodeInfo();
				setIsConnected(true);
			} catch (err) {
				setIsConnected(false);
			}
		};

		const interval = setInterval(() => {
			isConnected();
		}, config.blockTime);

		return () => {
			clearInterval(interval);
		};
	}, []);

	const renderNumber = (n?: number) => (n ? n.toLocaleString() : 0);

	return (
		<div>
			<div className="flex justify-between">
				<p>
					<span className="text-indigo-200 text-xs mr-2">Players alive:</span>
					{renderNumber(stats?.playersAlive)}
				</p>
				<p>
					<span className="text-indigo-200 text-xs mr-2">Defeated players:</span>
					{renderNumber(stats?.playersDefeated)}
				</p>
			</div>

			<div className="flex justify-between">
				<p>
					<span className="text-indigo-200 text-xs mr-2">Monsters alive:</span>
					{renderNumber(stats?.monstersAlive)}
				</p>
				<p>
					<span className="text-indigo-200 text-xs mr-2">Defeated monsters:</span>
					{renderNumber(stats?.monstersDefeated)}
				</p>
			</div>
			<p className="text-center mt-2">
				{isConnected ? (
					<span className="text-green-400 text-xs">Connected</span>
				) : (
					<span className="text-red-400 text-xs">Disconnected</span>
				)}
			</p>
		</div>
	);
};

export default WorldStatsCard;
