import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

import GameIntroductionScreen from './components/screens/GameIntroduction';
import Header from './components/ui/navbar/Header';
import StatSummary from './components/ui/StatSummary';
import WorldLog from './components/WorldLog';
import WorldStats from './components/WorldStats';
import { PlayerContext } from './contexts/playerContext';
import { EventType } from './enums';
import Routes from './Routes';
import * as api from './services/api';
import { AccountProps, Credentials } from './types';
import * as storage from './utils/storage';

function App() {
	const [playerCredentials, setPlayerCredentials] = useState<Credentials | null>(
		storage.getFromLocalStorage('credentials'),
	);
	const [playerAccount, setPlayerAccount] = useState<AccountProps | null>(null);
	const credentialRef = useRef<null | Credentials>(playerCredentials);
	const [hideIntro, setHideIntro] = useState(storage.getFromLocalStorage('hideWelcomeScreen') || false);

	useEffect(() => {
		credentialRef.current = playerCredentials;
		refreshAccount();
	}, [playerCredentials]);

	useEffect(() => {
		const newBlockEventHandler = () => {
			refreshAccount();
		};

		api.subscribeToEvent(newBlockEventHandler, EventType.newBlock);
	}, []);

	const refreshAccount = async () => {
		if (credentialRef.current === null) {
			setPlayerAccount(null);
			return;
		}

		try {
			const data = await api.getAccount(credentialRef.current.binaryAddress);
			if (!_.isEqual(playerAccount, data)) {
				setPlayerAccount(data);
			}
		} catch (err) {
			// sendNotification('error', 'OOPS!', err as string);
		}
	};

	const updatePlayerCredentials = (credentials: Credentials | null) => {
		setPlayerCredentials(credentials);

		if (credentials) {
			storage.setToLocalStorage(credentials, 'credentials');
		}
	};

	const signOut = () => {
		storage.removeItemFromStorage('credentials');
		setPlayerCredentials(null);
		setPlayerAccount(null);
	};

	const enterGame = () => {
		setHideIntro(true);
	};

	return (
		<div>
			<PlayerContext.Provider
				value={{
					playerCredentials,
					updatePlayerCredentials,
					playerAccount,
					signOut,
				}}
			>
				<Header disableNavBar={!hideIntro} />

				<div className="content-container p-8">
					<div className="grid grid-cols-12 gap-8 content-height">
						{hideIntro ? (
							<>
								<div className="col-span-8 custom-rounded-lg bg-gray-600">
									<div className="content-height overflow-y-auto overflow-x-hidden px-4">
										<Routes />
									</div>
								</div>
								<div className="col-span-4">
									<div className="flex flex-col gap-8 h-full">
										<div className="custom-rounded-lg bg-gray-900 ">
											<StatSummary />
										</div>

										<div className="custom-rounded-lg bg-gray-900 h-full">
											<WorldLog />
										</div>

										<div className="custom-rounded-lg bg-gray-900">
											<WorldStats />
										</div>
									</div>
								</div>
							</>
						) : (
							<div className="col-span-12 custom-rounded-lg bg-gray-600">
								<div className="content-height overflow-y-auto overflow-x-hidden px-4">
									<GameIntroductionScreen handler={enterGame} />
								</div>
							</div>
						)}
					</div>
				</div>
			</PlayerContext.Provider>
		</div>
	);
}

export default App;
