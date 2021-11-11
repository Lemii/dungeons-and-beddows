import { useEffect, useState } from 'react';

import { ActionType } from '../enums';
import * as api from '../services/api';

const usePlayerNames = () => {
	const [names, setNames] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchNames = async () => {
			const data = await api.invokeAction<string[]>(ActionType.GetPlayerNames, undefined, undefined, 0);
			setNames(data);
			setIsLoading(false);
		};

		fetchNames();
	}, []);

	return { names, isLoading };
};

export default usePlayerNames;
