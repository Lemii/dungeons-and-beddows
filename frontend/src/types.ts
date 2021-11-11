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
	items: InventoryItem[];
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

export type ChainState = {
	monsters: Monster[];
	afterlife: Monster[];
	players: Player[];
};

export type InventoryItem = {
	purchaseId: string;
	itemId: string;
};

export type BaseEventData = {
	eventId: string;
};

export type LevelUpEventReturnData = BaseEventData & { player: Player };

export type RegisterEventReturnData = BaseEventData & { name: string };

export type MonsterSpawnEventReturnData = BaseEventData & Monster;

export type WaveSpawnEventReturnData = BaseEventData & { intensity: 'easy' | 'normal' | 'hard' | 'extreme' };

export type GenericEventReturnData = BaseEventData & {
	player: string;
	monster: string;
};

export type FleeEventReturnData = BaseEventData &
	GenericEventReturnData & {
		goldLost: number;
	};

// Taken from @liskhq/lisk-chain package
export interface AccountSchema {
	type: string;
	fieldNumber: number;
	properties: Record<string, unknown>;
	default: Record<string, unknown>;
}

export declare type AccountDefaultProps = {
	[name: string]:
		| {
				[key: string]: unknown;
		  }
		| undefined
		| Buffer;
};

export type PlayerContextType = {
	playerCredentials: Credentials | null;
	updatePlayerCredentials: (credentials: Credentials | null) => void;
	playerAccount: AccountProps | null;
	signOut: () => void;
};

export type Credentials = {
	liskAddress: string;
	binaryAddress: string;
	passphrase: string;
};

export type SortingOrder = 'asc' | 'desc';

export type Statistics = {
	monstersAlive: number;
	monstersDefeated: number;
	playersAlive: number;
	playersDefeated: number;
};
