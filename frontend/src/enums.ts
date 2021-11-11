export enum AssetId {
	'SpawnMonster' = 100, // Deprecated
	'SpawnWave' = 101, // Deprecated
	'Engage' = 200,
	'Attack' = 201,
	'Defend' = 202,
	'UseItem' = 203,
	'UseSkill' = 204,
	'Flee' = 205,
	'PurchaseConsumable' = 300,
	'PurchaseGear' = 301,
	'SellItem' = 399,
	'Register' = 400,
}

export enum EventType {
	Registered = 'rpg:playerRegistered',
	MonsterSpawned = 'rpg:monsterSpawned',
	WaveSpawned = 'rpg:waveSpawned',
	Engaged = 'rpg:monsterEngaged',
	MonsterDefeat = 'rpg:monsterDefeated',
	PlayerDefeat = 'rpg:playerDefeated',
	Ding = 'rpg:playerLeveled',
	Flee = 'rpg:playerFled',
	newBlock = 'app:block:new',
}

export enum ActionType {
	GetState = 'rpg:getState',
	GetMonsters = 'rpg:getMonsters',
	GetPlayers = 'rpg:getPlayers',
	GetStatistics = 'rpg:getStatistics',
	GetPlayerNames = 'rpg:getPlayerNames',
	GetAfterlife = 'rpg:getAfterlife',
	GetMonsterById = 'rpg:getMonsterById',
	GetMonstersByIds = 'rpg:getMonstersByIds',
	GetItems = 'rpg:getItems',
	GetAccount = 'app:getAccount',
}
