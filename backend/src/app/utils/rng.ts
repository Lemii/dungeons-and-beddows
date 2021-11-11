import * as seedrandom from 'seedrandom';

export const getPseudoRandomFloat = (seed: string): number => {
	const rng = seedrandom(seed);
	return rng();
};

export const getPseudoRandomNumberInRange = (min: number, max: number, seed: string): number => {
	const rng = getPseudoRandomFloat(seed);

	// Multiply by 100 to avoid floats
	const multiplier = 100;
	const maxMult = max * multiplier;
	const minMult = min * multiplier;
	const result = Math.floor(rng * (maxMult - minMult + 1) + minMult);

	return Math.round(result / 100);
};
