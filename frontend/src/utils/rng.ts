// Functionality in his file is shared with backend
import seedrandom from 'seedrandom';

export const getPseudoRandomFloat = (seed: string): number => {
	const rng = seedrandom(seed);
	return rng();
};

export const getPseudoRandomNumberInRange = (min: number, max: number, seed: string): number => {
	const rng = getPseudoRandomFloat(seed);
	return Math.floor(rng * (max - min + 1)) + min;
};

export const getRandomArrayElement = <T>(array: T[]): T => {
	return array[Math.floor(Math.random() * array.length)];
};
