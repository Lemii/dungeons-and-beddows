import { createContext } from 'react';

import { PlayerContextType } from '../types';

// This needs to be initialized with the correct fields
export const PlayerContext = createContext<PlayerContextType>({
	playerCredentials: null,
	updatePlayerCredentials: () => null,
	playerAccount: null,
	signOut: () => null,
});
