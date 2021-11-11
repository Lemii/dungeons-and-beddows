import { ReactElement } from 'react';

import title from '../../assets/ui/ui-introduction.png';
import Hr from '../ui/Hr';
import PreferenceCheckbox from '../ui/PreferenceCheckbox';
import StoryScreen from './StoryScreen';

type Props = {
	handler: () => void;
};

const GameIntroductionScreen = ({ handler }: Props): ReactElement => {
	return (
		<StoryScreen
			titleImage={title}
			text={`Welcome to Dungeons & Beddows: Battle of the 0 0 0!

D&B is a turn-based RPG game build on Lisk technology. In this game you go on an adventure to slay monsters, level up, earn gold, get better gear, run into random events, and much more.
            
The goal is to climb the leaderboards and get as far as you can. But be wary, it may not end well.

DISCLAIMER: 
This is an early build without much mobile optimization. It's recommended to use a desktop Chromium based browser (Chrome, Brave, Edge, etc).`}
			action={
				<div>
					<Hr />
					<button onClick={handler} className="animate-pulse text-yellow-300">
						Let's do this!
					</button>

					<div className="mt-4">
						<PreferenceCheckbox storageKey="hideWelcomeScreen" />
					</div>
				</div>
			}
		/>
	);
};

export default GameIntroductionScreen;
