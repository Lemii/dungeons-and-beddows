import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { getRandomArrayElement } from '../../utils/rng';
import StoryScreen from './StoryScreen';

const stories = ['Welcome, adventurer.. feel free to take a look around.'];

const ShopScreen = (): ReactElement => {
	return (
		<StoryScreen
			title="Entering Shop"
			text={getRandomArrayElement(stories)}
			action={
				<Link to="/shop" className="animate-pulse">
					Enter
				</Link>
			}
		/>
	);
};

export default ShopScreen;
