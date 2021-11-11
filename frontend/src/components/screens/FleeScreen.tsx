import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import title from '../../assets/ui/ui-disappointment.png';
import { getRandomArrayElement } from '../../utils/rng';
import StoryScreen from './StoryScreen';

const stories = [
	"You break loose of the monster's claws and leave the battleground unscathed. However... as retribution for your weak actions, some gold might be lost forever.",
];

const FleeScreen = (): ReactElement => {
	return (
		<StoryScreen
			titleImage={title}
			text={getRandomArrayElement(stories)}
			action={
				<Link to="/hunt" className="animate-pulse">
					'I feel bad, but continue with my journey...'
				</Link>
			}
		/>
	);
};

export default FleeScreen;
