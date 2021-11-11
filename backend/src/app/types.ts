export type BaseEntity = {
	id: string; // uuid for Monsters, binary address for Players
	status: {
		type: 'alive' | 'dead' | 'unregistered';
		statusUpdated: number;
	};
	name: string;
	lvl: number;
	hp: {
		max: number;
		current: number;
	};
	mp: {
		max: number;
		current: number;
	};
	dmg: number;
	def: number;
	inBattleWith: EntitySummary;
	defeatedBy: EntitySummary;
	entitiesDefeated: EntitySummary[];
};

export type Monster = BaseEntity;

export type Player = BaseEntity & {
	xp: number;
	gold: number;
	gear: {
		weapon: string;
		head: string;
		body: string;
		feet: string;
	};
	items: {
		itemId: string;
		purchaseId: string; // transaction id of purchase
	}[];
	totalDamageDealt: number;
	totalDamageTaken: number;
	timesFled: number;
};

export type EntitySummary = {
	name: string;
	id: string; // either an address or monster id
};

export type AccountProps = {
	address: Buffer;
	rpg: Player;
};

export type Weapon = {
	id: string;
	name: string;
	attackRating: number;
	type: string;
	weaponType: 'sword' | 'staff' | 'halbert';
	value: number;
};

export type Armor = {
	id: string;
	name: string;
	defenseRating: number;
	type: 'head' | 'body' | 'feet';
	value: number;
};

export type ItemEffect = 'hpUp' | 'mpUp' | 'xpUp';

export type Item = {
	id: string;
	name: string;
	effect: ItemEffect;
	amount: number;
	value: number;
};

export type Skill = {};

export type Statistics = {
	monstersAlive: number;
	monstersDefeated: number;
	playersAlive: number;
	playersDefeated: number;
};

export type ChainState = {
	monsters: Monster[];
	afterlife: Monster[];
	players: Player[];
	statistics: Statistics;
};
