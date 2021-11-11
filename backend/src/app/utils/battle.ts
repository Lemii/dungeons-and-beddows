import { cryptography } from 'lisk-sdk';

import * as defaults from '../defaults';
import { AccountProps, ChainState, Monster } from '../types';
import * as helpers from './helpers';
import { getPseudoRandomNumberInRange } from './rng';
import * as validation from './validation';

export const calculateAttackDamage = (
	attackerDamage: number,
	maxDamageDeviation: number,
	recipientDefense: number,
	seed: string,
) => {
	const dmgDev = attackerDamage * maxDamageDeviation;
	const rngDmg = getPseudoRandomNumberInRange(attackerDamage - dmgDev, attackerDamage + dmgDev, seed);
	const calculatedDamage = rngDmg - recipientDefense;

	if (calculatedDamage < 0) {
		return 0;
	}

	return Math.round(calculatedDamage);
};

export const processBattleMove = (
	playerInput: AccountProps,
	monsterInput: Monster,
	action: 'attacking' | 'defending' | 'useItem',
	txId: string,
	storeDataInput: ChainState,
) => {
	const [seedA, seedB, seedC, seedD] = helpers.chunkSubstr(txId); // Use the tx id to generate multiple 'random' seeds

	const player = playerInput;
	const monster = monsterInput;
	const storeData = storeDataInput;

	const playerEntitySummary = helpers.buildEntitySummary(player.rpg.name, cryptography.bufferToHex(player.address));
	const emptyEntitySummary = helpers.getEmptyEntitySummary();

	if (action === 'attacking') {
		const playerDamage = calculateAttackDamage(
			player.rpg.dmg + helpers.getGearAttack(player.rpg),
			defaults.playerDefaults.dmg.maxDeviation,
			monster.def,
			seedA,
		);

		const monsterRemainingHp = monster.hp.current - playerDamage;
		if (monsterRemainingHp <= 0) {
			monster.hp.current = 0;
			monster.status = {
				type: 'dead',
				statusUpdated: 0, // To do: add ts to tx asset and use here
			};
			monster.defeatedBy = playerEntitySummary;
			monster.inBattleWith = emptyEntitySummary;

			storeData.statistics.monstersAlive -= 1;
			storeData.statistics.monstersDefeated += 1;
		} else {
			monster.hp.current = monsterRemainingHp;
		}

		player.rpg.totalDamageDealt += playerDamage;
	}

	if (!validation.isAlive(monster)) {
		const rewards = helpers.calculateRewards(monster, seedC, seedD);
		player.rpg.gold += rewards.gold;
		player.rpg.xp += rewards.xp;
		const newLevel = helpers.calcLevel(player.rpg.xp);

		// DING DING DING!
		if (newLevel > player.rpg.lvl) {
			const levelUpBonus = defaults.getLevelUpBonus(newLevel);
			player.rpg.lvl = newLevel;

			player.rpg.hp.max += levelUpBonus.hp;
			player.rpg.mp.max += levelUpBonus.mp;

			// Increase defense on every third level
			if (newLevel % 3 === 0) {
				player.rpg.def += levelUpBonus.def;
			}

			// Increase attack on every other level
			if (newLevel % 2 === 0) {
				player.rpg.dmg += levelUpBonus.dmg;
			}
		}

		player.rpg.entitiesDefeated.push(player.rpg.inBattleWith);
		player.rpg.inBattleWith = emptyEntitySummary;
		monster.inBattleWith = emptyEntitySummary;
		storeData.afterlife.push(monster);
		storeData.monsters = storeData.monsters.filter(m => m.id !== monster.id);
	} else {
		const monsterDamage = calculateAttackDamage(
			monster.dmg,
			defaults.monsterDefaults.dmg.maxDeviation,
			helpers.getBaseDef(player.rpg, action === 'defending') + helpers.getGearDefense(player.rpg),
			seedB,
		);

		const playerRemainingHp = player.rpg.hp.current - monsterDamage;
		player.rpg.totalDamageTaken += monsterDamage;

		if (playerRemainingHp <= 0) {
			player.rpg.hp.current = 0;
			player.rpg.status = {
				type: 'dead',
				statusUpdated: 0, // To do: add ts to tx asset and use here
			};
			player.rpg.defeatedBy = monster;
			player.rpg.inBattleWith = emptyEntitySummary;
			monster.inBattleWith = helpers.getEmptyEntitySummary();
			monster.entitiesDefeated.push(playerEntitySummary);
			monster.hp.current = monster.hp.max;

			storeData.statistics.playersAlive -= 1;
			storeData.statistics.playersDefeated += 1;
		} else {
			player.rpg.hp.current = playerRemainingHp;
		}
	}
};
