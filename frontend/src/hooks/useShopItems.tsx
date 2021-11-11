import { useEffect, useState } from 'react';

import { ActionType } from '../enums';
import * as api from '../services/api';
import { Armor, Item, Weapon } from '../types';

export type ShopItems = {
	consumables: Item[];
	armor: Armor[];
	weapons: Weapon[];
};

const INITIAL_STATE: ShopItems = {
	consumables: [],
	armor: [],
	weapons: [],
};

const useShopItems = () => {
	const [items, setItems] = useState<ShopItems>(INITIAL_STATE);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchShopItems = async () => {
			const data = await api.invokeAction<ShopItems>(ActionType.GetItems, undefined, undefined, 0);
			setItems(data);
			setIsLoading(false);
		};

		fetchShopItems();
	}, []);

	return { items, isLoading };
};

export default useShopItems;
