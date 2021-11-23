import { Armor, Item, Weapon } from './types';

export const consumables: Item[] = [
	{ id: 'hp_t1', name: 'Small Health Potion', effect: 'hpUp', amount: 5, value: 10 },
	{ id: 'hp_t2', name: 'Medium Health Potion', effect: 'hpUp', amount: 20, value: 50 },
	{ id: 'hp_t3', name: 'Large Health Potion', effect: 'hpUp', amount: 75, value: 250 },
	{ id: 'mp_t1', name: 'Small Mana Potion', effect: 'mpUp', amount: 5, value: 5 },
	{ id: 'mp_t2', name: 'Medium Mana Potion', effect: 'mpUp', amount: 20, value: 25 },
	{ id: 'mp_t3', name: 'Large Mana Potion', effect: 'mpUp', amount: 75, value: 125 },
];

export const armor: Armor[] = [
	{ id: 'mage-head_t1', name: 'Cloth Hat', type: 'head', defenseRating: 1, value: 75 },
	{ id: 'mage-body_t1', name: 'Cloth Robe', type: 'body', defenseRating: 1, value: 75 },
	{ id: 'mage-feet_t1', name: 'Cloth Shoes', type: 'feet', defenseRating: 1, value: 75 },
	{ id: 'knight-head_t1', name: 'Plate Helmet', type: 'head', defenseRating: 2, value: 200 },
	{ id: 'knight-body_t1', name: 'Plate Body Armor', type: 'body', defenseRating: 2, value: 200 },
	{ id: 'knight-feet_t1', name: 'Plate Shoes', type: 'feet', defenseRating: 2, value: 200 },
];

export const weapons: Weapon[] = [
	{ id: 'sword_t1', name: 'Common Sword', weaponType: 'sword', type: 'weapon', attackRating: 1, value: 75 },
	{ id: 'sword_t2', name: 'Uncommon Sword', weaponType: 'sword', type: 'weapon', attackRating: 2, value: 200 },
	{ id: 'sword_t3', name: 'Rare Sword', weaponType: 'sword', type: 'weapon', attackRating: 3, value: 500 },
	{ id: 'sword_t4', name: 'Epic Sword', weaponType: 'sword', type: 'weapon', attackRating: 4, value: 1250 },
	// { id: 'sword_t5', name: 'Legendary Sword', weaponType: 'sword', type: 'weapon', attackRating: 5, value: 4500 },
	{ id: 'halbert_t1', name: 'Common Halbert', weaponType: 'halbert', type: 'weapon', attackRating: 1, value: 75 },
	{ id: 'halbert_t2', name: 'Uncommon Halbert', weaponType: 'halbert', type: 'weapon', attackRating: 2, value: 200 },
	{ id: 'halbert_t3', name: 'Rare Halbert', weaponType: 'halbert', type: 'weapon', attackRating: 3, value: 500 },
	{ id: 'halbert_t4', name: 'Epic Halbert', weaponType: 'halbert', type: 'weapon', attackRating: 4, value: 1250 },
	// { id: 'halbert_t5', name: 'Legendary Halbert', weaponType: 'halbert', type: 'weapon', attackRating: 5, value: 4500 },
	{ id: 'staff_t1', name: 'Common Staff', weaponType: 'staff', type: 'weapon', attackRating: 1, value: 75 },
	{ id: 'staff_t2', name: 'Uncommon Staff', weaponType: 'staff', type: 'weapon', attackRating: 2, value: 200 },
	{ id: 'staff_t3', name: 'Rare Staff', weaponType: 'staff', type: 'weapon', attackRating: 3, value: 500 },
	{ id: 'staff_t4', name: 'Epic Staff', weaponType: 'staff', type: 'weapon', attackRating: 4, value: 1250 },
	// { id: 'staff_t5', name: 'Legendary Staff', weaponType: 'staff', type: 'weapon', attackRating: 5, value: 5000 },
];
