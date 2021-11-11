export type StorageKey =
	| 'disableTypewriterEffect'
	| 'hideSplash'
	| 'credentials'
	| 'hideButtonLabels'
	| 'afterlifeSort'
	| 'afterlifeView'
	| 'huntSort'
	| 'huntView'
	| 'hideLowLevel'
	| 'leaderboardsSort'
	| 'hideWelcomeScreen'
	| 'hideBattleInstructions';

export const setToLocalStorage = (data: string | Object | boolean, key: StorageKey) => {
	const processed = typeof data === 'string' ? data : JSON.stringify(data);
	localStorage.setItem(key, processed);
};

export const getFromLocalStorage = <T>(key: StorageKey): T | null => {
	const data = localStorage.getItem(key);

	let parsed;
	try {
		parsed = data ? JSON.parse(data) : null;
	} catch (err) {
		parsed = data;
	}

	return parsed;
};

export const removeItemFromStorage = (key: StorageKey) => {
	localStorage.removeItem(key);
};
