import { BaseModuleDataAccess, codec, StateStore } from 'lisk-sdk';

import { STATE_STORE_INIT } from '../defaults';
import { CHAIN_STATE, ChainStateSchema } from '../modules/rpg/schemas';
import { ChainState } from '../types';

export const getStoreData = async (stateStore: StateStore): Promise<ChainState> => {
	const storeDataBuffer = await stateStore.chain.get(CHAIN_STATE);
	const storeData = storeDataBuffer ? codec.decode<ChainState>(ChainStateSchema, storeDataBuffer) : STATE_STORE_INIT;
	return storeData;
};

export const getModuleData = async (dataAccess: BaseModuleDataAccess): Promise<ChainState> => {
	const storeDataBuffer = await dataAccess.getChainState(CHAIN_STATE);
	const storeData = storeDataBuffer ? codec.decode<ChainState>(ChainStateSchema, storeDataBuffer) : STATE_STORE_INIT;
	return storeData;
};
