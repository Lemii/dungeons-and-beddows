import { ShopItems } from '../hooks/useShopItems';
import { Player } from '../types';

export const getGearAttack = (player: Player, items: ShopItems) => {
	const weapons = items.weapons;
	const item = weapons.find(w => w.id === player.gear.weapon);

	if (item) {
		return item.attackRating;
	}

	return 0;
};

export const getGearDefense = (player: Player, items: ShopItems) => {
	const armor = items.armor;
	let totalDef = 0;

	[player.gear.body, player.gear.feet, player.gear.head].forEach(g => {
		const item = armor.find(a => a.id === g);

		if (item) {
			totalDef += item.defenseRating;
		}
	});

	return totalDef;
};
