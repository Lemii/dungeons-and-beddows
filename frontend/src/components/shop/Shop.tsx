import { ReactElement, useContext, useState } from 'react';

import ShopKeeper from '../../assets/ui/shopkeeper.gif';
import config from '../../config';
import { PlayerContext } from '../../contexts/playerContext';
import { AssetId } from '../../enums';
import useShopItems from '../../hooks/useShopItems';
import * as transactions from '../../services/transactions';
import { sendNotification } from '../../utils/notifications';
import TypeWriter from '../screens/TypeWriter';
import Loading from '../ui/Loading';
import PixelatedImage from '../ui/PixelatedImage';
import ArmorItem from './ArmorItem';
import ConsumableItem from './ConsumableItem';
import WeaponItem from './WeaponItem';

const Shop = (): ReactElement => {
	const [disableAll, setDisableAll] = useState(false);
	const context = useContext(PlayerContext);
	const { items, isLoading } = useShopItems();

	const lockButtons = () => {
		setDisableAll(true);

		setTimeout(() => {
			setDisableAll(false);
		}, config.blockTime);
	};

	const sendBuyItemTx = async (id: string, assetId: AssetId) => {
		const pass = context.playerCredentials?.passphrase;

		if (!pass) {
			sendNotification('error', 'OOPS!', 'No passphrase found.');
			return;
		}

		try {
			await transactions.sendGenericTransaction(pass, assetId, { id });
			lockButtons();
		} catch (err) {
			sendNotification('error', 'OOPS!', err as string);
		}
	};

	const canAfford = (value: number) => !!context.playerAccount && context.playerAccount.rpg.gold >= value;

	const renderShopFooter = (value: number) => {
		const allowPurchase = canAfford(value);

		return (
			<div>
				<div className={`flex flex-between `}>
					<div className={`w-1/2`}>Price:</div>
					<div className={`w-1/2 text-right ) && 'text-red-300'}`}>{value} g</div>
				</div>

				{allowPurchase ? (
					<div className="text-center animate-pulse mt-3 text-yellow-300">Click to purchase</div>
				) : (
					<div className="text-center mt-3 text-red-400">Not enough gold</div>
				)}
			</div>
		);
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div>
			<div className="flex justify-between mb-16">
				<div className="content-center mt-8">
					{/* <h1 className="uppercase text-indigo-300">Shop</h1> */}
					<TypeWriter text="You look like an interesting fella... Feel free to take a look around." />
				</div>
				<PixelatedImage src={ShopKeeper} alt="Shop Keeper" className="h-24 " />
			</div>

			{items && (
				<div>
					<h1 className="mb-4">Consumables</h1>
					<div className="grid gap-4 mb-16 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
						{items.consumables.map(c => (
							<div>
								<ConsumableItem
									consumable={c}
									key={c.id}
									disabled={disableAll}
									buttonCallback={() => sendBuyItemTx(c.id, AssetId.PurchaseConsumable)}
									footer={renderShopFooter(c.value)}
									canAfford={canAfford(c.value)}
								/>
							</div>
						))}
					</div>

					<h1 className="mb-4">Weapons</h1>
					<div className="grid grid-cols-4 gap-8 mb-16">
						{items.weapons.map(w => (
							<WeaponItem
								weapon={w}
								key={w.id}
								disabled={disableAll}
								buttonCallback={() => sendBuyItemTx(w.id, AssetId.PurchaseGear)}
								footer={renderShopFooter(w.value)}
								canAfford={canAfford(w.value)}
							/>
						))}
					</div>

					<h1 className="mb-4">Armor</h1>
					<div className="grid grid-cols-3 gap-8 mb-16">
						{items.armor.map(a => (
							<ArmorItem
								armor={a}
								key={a.id}
								disabled={disableAll}
								buttonCallback={() => sendBuyItemTx(a.id, AssetId.PurchaseGear)}
								footer={renderShopFooter(a.value)}
								canAfford={canAfford(a.value)}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Shop;
