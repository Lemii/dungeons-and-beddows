import { maxLevelDifference } from '../defaults';
import { Monster, Player, PlayerContextType } from '../types';

export const isInBattle = (entity: Monster | Player) => !!entity.inBattleWith.name;

export const isAlive = (entity: Monster | Player) => entity.status.type === 'alive';

export const isRegistered = (entity: Monster | Player) => !!entity.name;

export const isInLevelRange = (monster: Monster, player: Player) => !(player.lvl - monster.lvl > maxLevelDifference);

export const isAuthenticated = (context: PlayerContextType) => !!context.playerAccount && !!context.playerCredentials;
