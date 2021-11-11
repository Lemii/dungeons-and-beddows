import * as defaults from '../defaults';
import monsterNames from '../names';
import { Monster } from '../types';
import { getPseudoRandomNumberInRange } from './rng';

const getHp = (level: number): { max: number; current: number } => {
	if (level === 1) {
		return {
			max: defaults.monsterDefaults.hp,
			current: defaults.monsterDefaults.hp,
		};
	}

	const hp = Math.floor(defaults.monsterDefaults.hp * (level * 0.75));

	return { max: hp, current: hp };
};

const getMp = (level: number): { max: number; current: number } => {
	if (level === 1) {
		return {
			max: defaults.monsterDefaults.mp,
			current: defaults.monsterDefaults.mp,
		};
	}

	const mp = Math.floor(defaults.monsterDefaults.mp * (level * 0.75));

	return { max: mp, current: mp };
};

const getDmg = (level: number): number => {
	if (level === 1) {
		return defaults.monsterDefaults.dmg.base;
	}

	return Math.floor(defaults.monsterDefaults.dmg.base * (level * 0.66));
};

const getDef = (level: number): number => {
	if (level === 1) {
		return defaults.monsterDefaults.def;
	}

	if (level === 2) {
		return defaults.monsterDefaults.def + 1;
	}

	return Math.floor(defaults.monsterDefaults.def + level * 0.5);
};

export const generateMonster = (lvl: number, seed: string): Monster => {
	const randomIndex = getPseudoRandomNumberInRange(0, monsterNames.length - 1, seed);
	const name = monsterNames[randomIndex];

	return {
		id: seed,
		lvl,
		name,
		status: {
			type: 'alive',
			statusUpdated: 0, // To do: use tx ts
		},
		hp: getHp(lvl),
		mp: getMp(lvl),
		dmg: getDmg(lvl),
		def: getDef(lvl),
		entitiesDefeated: [],
		defeatedBy: {
			name: '',
			id: '',
		},
		inBattleWith: {
			name: '',
			id: '',
		},
	};
};
