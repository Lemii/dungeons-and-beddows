import _ from 'lodash';
import { ReactElement, useContext, useState } from 'react';

import config from '../config';
import { PlayerContext } from '../contexts/playerContext';
import { AssetId } from '../enums';
import { ShopItems } from '../hooks/useShopItems';
import * as transactions from '../services/transactions';
import { InventoryItem } from '../types';
import { sendNotification } from '../utils/notifications';
import Consumable from './shop/ConsumableItem';
import Empty from './ui/Empty';
import Loading from './ui/Loading';

type Props = {
	cols?: number;
	inventoryItems: InventoryItem[];
	shopItems: ShopItems;
	nonInteractive?: boolean;
};

const Inventory = ({ cols = 6, inventoryItems, nonInteractive, shopItems }: Props): ReactElement => {
	const [disableAll, setDisableAll] = useState(false);
	const context = useContext(PlayerContext);

	const lockButtons = () => {
		setDisableAll(true);
		setTimeout(() => {
			setDisableAll(false);
		}, config.blockTime);
	};

	const sendUseItemTx = async (purchaseId: string) => {
		const pass = context.playerCredentials?.passphrase;

		if (!pass) {
			sendNotification('error', 'OOPS!', 'No passphrase found.');
			return;
		}

		try {
			await transactions.sendGenericTransaction(pass, AssetId.UseItem, { purchaseId });
			lockButtons();
		} catch (err) {
			sendNotification('error', 'OOPS!', err as string);
		}
	};

	const renderItem = (item: InventoryItem) => {
		const consumable = shopItems.consumables.find(c => c.id === item.itemId);

		if (!consumable) {
			sendNotification('error', 'Oops!', 'Could not find item');
			return;
		}

		return (
			<Consumable
				key={item.purchaseId}
				consumable={consumable}
				buttonCallback={() => sendUseItemTx(item.purchaseId)}
				disabled={disableAll}
				footer={
					!nonInteractive ? (
						<div className="text-center animate-pulse mt-2 text-yellow-300">Click to use</div>
					) : undefined
				}
				nonInteractive={nonInteractive}
			/>
		);
	};

	if (_.isEmpty(shopItems.consumables)) {
		return <Loading />;
	}

	const consumables = inventoryItems;

	return _.isEmpty(consumables) ? (
		<Empty className="h-56" />
	) : (
		<div className={`grid grid-cols-${cols} gap-4 mb-16 h-56`}>
			{consumables.map(c => (
				<div key={c.purchaseId}>{renderItem(c)}</div>
			))}
		</div>
	);
};

export default Inventory;
