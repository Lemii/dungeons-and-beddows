import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import title from '../../assets/ui/ui-victorious.png';
import { getRandomArrayElement } from '../../utils/rng';
import StoryScreen from './StoryScreen';

const stories = [
	'After an extensive and exhilarating battle with the furious beast, you chop off his head and come out victorious.',
	'You stab the beast in the eye. Your knife comes out at the other end. It falls to the ground, and you make your way out of here.',
];

const MonsterDefeatScreen = (): ReactElement => {
	return (
		<StoryScreen
			titleImage={title}
			text={getRandomArrayElement(stories)}
			action={
				<Link to="/hunt" className="animate-pulse">
					Continue...
				</Link>
			}
		/>
	);
};

export default MonsterDefeatScreen;
