import { ReactElement, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import config from '../../config';
import { PlayerContext } from '../../contexts/playerContext';
import { AssetId } from '../../enums';
import * as transactions from '../../services/transactions';
import { Credentials } from '../../types';
import Check from '../ui/Check';
import Error from '../ui/Error';
import Loading from '../ui/Loading';

type Props = {
	credentials: Credentials;
	name: string;
};

const CustomSpinner = () => (
	<div className="mr-2 mt-2">
		<Loading scale={40} spinnerOnly />
	</div>
);

const ProcessRegistration = ({ credentials, name }: Props): ReactElement => {
	const context = useContext(PlayerContext);
	const history = useHistory();

	const [fundingComplete, setFundingComplete] = useState(false);
	const [registrationComplete, setRegistrationComplete] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		fundAccount();

		setTimeout(() => {
			registerName();
		}, config.blockTime + 1000);
	}, []);

	const fundAccount = async () => {
		if (fundingComplete) {
			return;
		}

		setError('');

		try {
			await transactions.fundAccount(credentials.liskAddress);

			setTimeout(() => {
				setFundingComplete(true);
			}, config.blockTime);
		} catch (err) {
			setError((err as Error).message);
		}
	};

	const registerName = async () => {
		if (registrationComplete) {
			return;
		}

		setError('');

		try {
			await transactions.sendGenericTransaction(credentials.passphrase, AssetId.Register, { name });

			setTimeout(() => {
				setRegistrationComplete(true);
			}, config.blockTime);
		} catch (err) {
			setError((err as Error).message);
		}
	};

	const handleSignIn = () => {
		context.updatePlayerCredentials(credentials);
		history.push('/my-profile');
	};

	return (
		<div className="w-full">
			<div className="flex justify-between h-10">
				<div className="mt1">Casting divine spells..</div>
				<div>{fundingComplete ? <Check /> : <CustomSpinner />}</div>
			</div>

			<div className="flex justify-between h-16">
				<div className="mt-1">Informing world of your presence..</div>
				<div>{registrationComplete ? <Check /> : <CustomSpinner />}</div>
			</div>

			<Error message={error} />

			{fundingComplete && registrationComplete && (
				<button onClick={handleSignIn} className="animate-pulse text-yellow-300 text-xl">
					Continue...
				</button>
			)}
		</div>
	);
};

export default ProcessRegistration;
