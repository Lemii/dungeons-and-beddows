import { ReactElement, useContext } from 'react';

import { PlayerContext } from '../../contexts/playerContext';
import ProfileScreen from './ProfileScreen';

const Profile = (): ReactElement => {
	const context = useContext(PlayerContext);

	return <ProfileScreen account={context.playerAccount} />;
};

export default Profile;
