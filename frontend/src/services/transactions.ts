import { cryptography } from '@liskhq/lisk-client';
import * as transactions from '@liskhq/lisk-transactions';

import config from '../config';
import { AssetId } from '../enums';
import * as api from './api';

export const sendGenericTransaction = async (
	passphrase: string,
	assetID: AssetId,
	asset: Record<string, unknown> = {},
) => {
	const client = await api.getClient();

	const tx = await client.transaction.create(
		{
			moduleID: 1000,
			assetID,
			fee: BigInt(200000),
			asset,
		},
		passphrase,
	);

	return client.transaction.send(tx);
};

export const fundAccount = async (address: string) => {
	const passphrase = config.fundPassphrase;

	if (!passphrase) {
		throw new Error('No funding passphrase has been configured');
	}

	const client = await api.getClient();

	const asset = {
		amount: BigInt('1000000000000'),
		recipientAddress: cryptography.getAddressFromLisk32Address(address),
		data: 'Fund account',
	};

	const tx = await client.transaction.create(
		{
			moduleName: 'token',
			assetName: 'transfer',
			fee: BigInt(transactions.convertLSKToBeddows('1')),
			asset,
		},
		passphrase,
	);

	return client.transaction.send(tx);
};
