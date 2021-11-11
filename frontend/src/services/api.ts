import { apiClient } from '@liskhq/lisk-client';

import config from '../config';
import { ActionType, EventType } from '../enums';
import { AccountProps } from '../types';

const RPC_ENDPOINT = config.api;

export let clientCache: apiClient.APIClient;

export const getClient = async () => {
	if (!RPC_ENDPOINT) {
		throw new Error('No RPC endpoint defined');
	}
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
	}
	return clientCache;
};

export const subscribeToEvent = async (handler: (data: any) => void, event: EventType, api?: apiClient.APIClient) => {
	const client = api || (await getClient());
	client.subscribe(event, data => handler(data));
};

export const invokeAction = async <T>(
	action: ActionType,
	arg: Record<string, unknown> = {},
	api?: apiClient.APIClient,
	delay = 100,
): Promise<T> => {
	const client = api || (await getClient());

	// Use small timeout to ensure chain returns updated data
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const data = await client.invoke<T>(action, arg);
			resolve(data);
		}, delay);
	});
};

export const getAccount = async (address: string, api?: apiClient.APIClient) => {
	const client = api || (await getClient());
	const data: unknown = client.account.get(address);
	return data as AccountProps;
};
