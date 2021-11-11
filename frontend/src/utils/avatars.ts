import placeholder from '../assets/placeholder.png';
import { getPseudoRandomNumberInRange } from './rng';

function importAll(r: any) {
	let images: any[] = [];
	r.keys().forEach((item: any) => {
		images.push(r(item).default);
	});
	return images;
}

const monsterAvatars = importAll(require.context('../assets/monsters/', false, /\.(png|jpe?g|svg|gif)$/));

export const getMonsterAvatar = (seed: string) => {
	const randomIndex = getPseudoRandomNumberInRange(0, monsterAvatars.length - 1, seed);
	return monsterAvatars[randomIndex];
};

export const getPlayerAvatar = (seed: string) => {
	return placeholder;
};
