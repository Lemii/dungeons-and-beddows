import { ReactElement, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import usePlayerNames from '../../hooks/usePlayerNames';
import { getCredentials } from '../../utils/crypto';
import { isValidName } from '../../utils/helpers';
import Error from '../ui/Error';
import Input from '../ui/Input';
import Loading from '../ui/Loading';
import Modal from '../ui/Modal';
import ProcessRegistration from './ProcessRegistration';

type RegistrationSteps = 'enterName' | 'confirmPassphrase' | 'completeRegistration';

const Register = (): ReactElement => {
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [registrationStep, setRegistrationStep] = useState<RegistrationSteps>('enterName');
	const [copied, setCopied] = useState(false);
	const [credentials] = useState(getCredentials());
	const { names, isLoading } = usePlayerNames();
	const [showConfirm, setShowConfirm] = useState(false);

	useEffect(() => {
		if (names.map(n => n.toLocaleLowerCase()).includes(name.toLocaleLowerCase())) {
			setError('Name is already taken');
			return;
		}

		if (name && !isValidName(name)) {
			setError('Name must be between 3-16 characters and may only contain alphabetical characters');
			return;
		}

		setError('');
	}, [name, names]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value.trim());
	};

	const handleCopyToClipboard = () => {
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 3000);
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="flex h-full">
			{showConfirm && (
				<Modal
					title="Super secret passphrase"
					handleClose={() => setShowConfirm(false)}
					confirmButton={{
						text: 'Yes! Let me go already!',
						onClick: () => setRegistrationStep('completeRegistration'),
					}}
					cancelText="No"
				>
					<div>Are you sure you have stored your passphrase safely?</div>
				</Modal>
			)}
			<div className="m-auto text-center w-3/4 max-w-lg">
				<div className="m-auto">
					{registrationStep === 'enterName' && (
						<div>
							<h1 className="mb-12">
								Glad to see you, stranger.
								<br />
								What is your name?
							</h1>

							<div className="max-w-md m-auto">
								<Input
									value={name}
									type="text"
									onChange={handleInputChange}
									label="Enter name"
									placeholder="Enter name"
									isValid={!error && isValidName(name)}
								/>

								{error && <Error message={error} />}

								<button
									className="btn btn-primary mt-8"
									onClick={() => setRegistrationStep('confirmPassphrase')}
									disabled={!!error || !isValidName(name)}
								>
									Confirm
								</button>
							</div>
						</div>
					)}

					{registrationStep === 'confirmPassphrase' && (
						<div>
							<h2 className="mb-4">
								Nice to meet you, <span className="text-indigo-300">{name}</span>.
							</h2>

							<h4 className="mb-12">
								Here is your secret <span className="text-indigo-300">passphrase</span>. Please keep it safe.
							</h4>

							<div className="custom-rounded-sm border-2 border-indigo-200 grid grid-cols-3 lg:grid-cols-4 gap-4 xl:grid-cols-6 max-w-2xl m-auto mb-4">
								{credentials.passphrase.split(' ').map(word => (
									<div key={word} className="">
										{word}
									</div>
								))}
							</div>

							<CopyToClipboard text={credentials.passphrase} onCopy={handleCopyToClipboard}>
								{copied ? (
									<span>Copied!</span>
								) : (
									<span className="animate-pulse text-yellow-300 cursor-pointer">Copy to clipboard</span>
								)}
							</CopyToClipboard>

							<button className="btn btn-primary mt-12 block mx-auto" onClick={() => setShowConfirm(true)}>
								Continue
							</button>
						</div>
					)}

					{registrationStep === 'completeRegistration' && (
						<div>
							<h2 className="mb-12">Good. Now let me prepare you for your journey.</h2>

							<ProcessRegistration credentials={credentials} name={name} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Register;
