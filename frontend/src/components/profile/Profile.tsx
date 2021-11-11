import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import * as api from '../../services/api';
import { AccountProps } from '../../types';
import ProfileScreen from './ProfileScreen';

const Profile = (): ReactElement => {
	const [player, setPlayer] = useState<AccountProps | null>(null);

	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const updateAccount = async () => {
			const data = await api.getAccount(id);
			if (data) {
				setPlayer(data);
			}
		};

		updateAccount();
	}, [id]);

	return <ProfileScreen account={player} nonInteractive />;
};

export default Profile;
