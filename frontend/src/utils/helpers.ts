import * as defaults from '../defaults';
import { Monster } from '../types';

export const calculatePotentialRewards = (monster: Monster) => {
	const baseXp =
		monster.lvl === 1
			? defaults.xpReward.base
			: defaults.xpReward.base + Math.round(monster.lvl * defaults.xpReward.levelMultiplier);
	const xpDev = Math.round(baseXp * defaults.xpReward.maxDeviation);
	const xp = { min: baseXp - xpDev, max: baseXp + xpDev };

	const baseGold =
		monster.lvl === 1
			? defaults.goldReward.base
			: defaults.goldReward.base + Math.round(monster.lvl * defaults.goldReward.levelMultiplier);
	const goldDev = Math.round(baseGold * defaults.goldReward.maxDeviation);
	const gold = { min: baseGold - goldDev, max: baseGold + goldDev };

	return { gold, xp };
};

export const calculateDamageRange = (dmg: number, type: 'player' | 'monster') => {
	const values = type === 'player' ? defaults.playerDefaults : defaults.monsterDefaults;
	const dev = dmg * values.dmg.maxDeviation;
	return { min: Math.round(dmg - dev), max: Math.round(dmg + dev) };
};

export const isValidPassphrase = (passphrase: string) => {
	const words = passphrase.split(' ');
	return words.length === 12;
};

export const isValidName = (name: string) => {
	const regex = /^[A-Za-z]{3,16}$/;
	return !!regex.exec(name);
};

export const calcRequiredXp = (xp: number) => {
	let requiredXp = 0;

	for (const l of defaults.levels) {
		if (xp < l.requiredXp) {
			requiredXp = l.requiredXp;
			break;
		}
	}

	return requiredXp;
};

export const getDamageRange = (dmg: number, type: 'player' | 'monster') => {
	const range = calculateDamageRange(dmg, type);
	return `${range.min}-${range.max}`;
};
