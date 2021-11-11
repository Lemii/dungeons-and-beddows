import { cryptography } from '@liskhq/lisk-client';
import { ReactElement, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import { PlayerContext } from '../contexts/playerContext';
import { getAccount } from '../services/api';
import { getCredentials } from '../utils/crypto';
import { isValidPassphrase } from '../utils/helpers';
import { isAlive } from '../utils/validation';
import Error from './ui/Error';
import Input from './ui/Input';

const SignIn = (): ReactElement => {
	const [passphrase, setPassphrase] = useState('');
	const [error, setError] = useState('');

	const history = useHistory();
	const context = useContext(PlayerContext);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassphrase(e.target.value.trim());
	};

	const handleSignIn = async () => {
		setError('');

		if (!isValid) {
			setError('Please enter a valid passphrase of 12 words');
			return;
		}

		const { address } = cryptography.getAddressAndPublicKeyFromPassphrase(passphrase);
		const account = await getAccount(cryptography.bufferToHex(address));

		if (!account || !isAlive(account.rpg)) {
			setError('Invalid account (already dead?)');
			return;
		}

		const credentials = getCredentials(passphrase);
		context.updatePlayerCredentials(credentials);
		history.push('/my-profile');
	};

	const isValid = isValidPassphrase(passphrase);

	return (
		<div className="flex h-full">
			<div className="m-auto text-center">
				<h1 className="mb-12">Welcome back, adventurer</h1>

				<div className="w-96 m-auto">
					<Input
						value={passphrase}
						type="password"
						onChange={handleInputChange}
						label="Enter passphrase"
						placeholder="Enter passphrase"
						isValid={isValidPassphrase(passphrase)}
					/>
					{error && <Error message={error} />}

					<button className="btn btn-primary mb-12 mt-8" onClick={handleSignIn}>
						Sign In
					</button>

					<p>
						Don't have a passphrase? <Link to="/register">Register here</Link>.
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
