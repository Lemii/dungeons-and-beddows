// Code in this file is shared with frontend
import { ChainState, Monster, Player } from './types';

// Starting stats for lvl 1 player
export const playerDefaults = {
	hp: 20,
	mp: 10,
	dmg: {
		base: 5,
		maxDeviation: 0.2, // 20 percent
	},
	def: 1,
};

// Starting stats for lvl 1 monster
export const monsterDefaults = {
	hp: 10,
	mp: 5,
	dmg: {
		base: 4,
		maxDeviation: 0.2, // 20 percent
	},
	def: 0,
};

export const goldReward = {
	base: 15,
	levelMultiplier: 0.8,
	maxDeviation: 0.1, // 20 percent
};

export const xpReward = {
	base: 5,
	levelMultiplier: 0.8,
	maxDeviation: 0.1, // 20 percent
};

export const getLevels = (numOfLevels = 50, exponent = 2) => {
	const levels = [
		{ lvl: 1, requiredXp: 0 },
		{ lvl: 2, requiredXp: 7 },
		{ lvl: 3, requiredXp: 16 },
	];

	for (let i = 4; i < numOfLevels; i += 1) {
		levels.push({ lvl: i, requiredXp: exponent ** i + 10 });
	}

	return levels;
};

export const levels = getLevels();

export const getLevelUpBonus = (lvl: number) => ({
	hp: Math.round(lvl * 1.33),
	mp: Math.round(lvl * 1),
	dmg: 1,
	def: 1,
});

// Restrict players from fighting too low level monsters
export const maxLevelDifference = 3;

// Multiplier for defense rating, used when performing 'defend' action
export const defMultiplier = 2;

export const STATE_STORE_INIT: ChainState = {
	monsters: [] as Monster[],
	players: [] as Player[],
	afterlife: [] as Monster[],
	statistics: {
		monstersAlive: 0,
		monstersDefeated: 0,
		playersAlive: 0,
		playersDefeated: 0,
	},
};
