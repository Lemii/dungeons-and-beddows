import { ReactElement, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import title from '../../assets/ui/ui-defeat.png';
import { PlayerContext } from '../../contexts/playerContext';
import { getRandomArrayElement } from '../../utils/rng';
import StoryScreen from './StoryScreen';

const stories = ['You have been defeated... R.I.P.'];

const PlayerDefeatScreen = (): ReactElement => {
	const context = useContext(PlayerContext);

	useEffect(() => {
		context.signOut();
	}, []);

	return (
		<StoryScreen
			titleImage={title}
			text={getRandomArrayElement(stories)}
			action={
				<Link to="/register" className="animate-pulse">
					'Hmpf... Let me try again!''
				</Link>
			}
		/>
	);
};

export default PlayerDefeatScreen;
