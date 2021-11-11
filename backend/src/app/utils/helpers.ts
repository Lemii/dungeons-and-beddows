import { defMultiplier, levels } from '../defaults';
import * as defaults from '../defaults';
import { armor, weapons } from '../items';
import { EntitySummary, Monster, Player } from '../types';
import { getPseudoRandomNumberInRange } from './rng';

export const buildEntitySummary = (name: string, id: string): EntitySummary => ({ name, id });

export const getEmptyEntitySummary = () => ({ name: '', id: '' });

// Inspired by: https://stackoverflow.com/a/29202760
export const chunkSubstr = (str: string, size = 8) => {
	const numChunks = Math.ceil(str.length / size);
	const chunks = new Array(numChunks);

	for (let i = 0, o = 0; i < numChunks; i += 1, o += size) {
		chunks[i] = str.substr(o, size);
	}

	return chunks as string[];
};

export const calcLevel = (xp: number) => {
	let level = 0;

	for (const l of levels) {
		if (xp > l.requiredXp) {
			level = l.lvl;
		} else {
			break;
		}
	}

	return level;
};

export const getNumOfMonsters = (monsters: Monster[]) => {
	let easy = 0;
	let normal = 0;
	let hard = 0;
	let extreme = 0;

	monsters.forEach(m => {
		if (m.lvl <= 2) easy += 1;
		if (m.lvl > 2 && m.lvl <= 8) normal += 1;
		if (m.lvl > 9 && m.lvl <= 16) hard += 1;
		if (m.lvl > 17) extreme += 1;
	});

	return { easy, normal, hard, extreme };
};

export const getGearAttack = (player: Player) => {
	const item = weapons.find(w => w.id === player.gear.weapon);

	if (item) {
		return item.attackRating;
	}

	return 0;
};

export const getGearDefense = (player: Player) => {
	let totalDef = 0;

	[player.gear.body, player.gear.feet, player.gear.head].forEach(g => {
		const item = armor.find(a => a.id === g);

		if (item) {
			totalDef += item.defenseRating;
		}
	});

	return totalDef;
};

export const getBaseDef = (player: Player, defending: boolean) => {
	if (defending && player.def) {
		return Math.round(player.def * defMultiplier);
	}

	if (defending && !player.def) {
		return 2;
	}

	return player.def;
};

export const calculateRewards = (monster: Monster, seedA: string, seedB: string): { xp: number; gold: number } => {
	const baseXp =
		monster.lvl === 1
			? defaults.xpReward.base
			: defaults.xpReward.base + Math.round(monster.lvl * defaults.xpReward.levelMultiplier);
	const xpDev = Math.round(baseXp * defaults.xpReward.maxDeviation);
	const xp = getPseudoRandomNumberInRange(baseXp - xpDev, baseXp + xpDev, seedA);

	const baseGold =
		monster.lvl === 1
			? defaults.goldReward.base
			: defaults.goldReward.base + Math.round(monster.lvl * defaults.goldReward.levelMultiplier);
	const goldDev = Math.round(baseGold * defaults.goldReward.maxDeviation);
	const gold = getPseudoRandomNumberInRange(baseGold - goldDev, baseGold + goldDev, seedB);

	return { gold, xp };
};
