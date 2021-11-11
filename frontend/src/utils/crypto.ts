import { cryptography } from '@liskhq/lisk-client';
import { Mnemonic } from '@liskhq/lisk-passphrase';

export const getCredentials = (pass?: string) => {
	const passphrase = pass || Mnemonic.generateMnemonic();

	return {
		liskAddress: cryptography.getBase32AddressFromPassphrase(passphrase),
		binaryAddress: cryptography.getAddressFromPassphrase(passphrase).toString('hex'),
		passphrase: passphrase,
	};
};
