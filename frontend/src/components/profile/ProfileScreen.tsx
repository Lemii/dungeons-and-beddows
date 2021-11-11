import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import useShopItems from '../../hooks/useShopItems';
import { AccountProps } from '../../types';
import Inventory from '../Inventory';
import Gear from './Gear';
import Statistics from './Statistics';
import StoryLine from './StoryLine';

type Props = {
	account: AccountProps | null;
	nonInteractive?: boolean;
};

const ProfileScreen = ({ account, nonInteractive }: Props): ReactElement => {
	const { items } = useShopItems();

	if (!account) {
		return (
			<div className="flex h-full">
				<div className="m-auto text-center w-96">
					No player data found. <Link to="/register">Sign up for the adventure?</Link>
				</div>
			</div>
		);
	}

	const player = account.rpg;

	return (
		<div>
			<div className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-8 mb-20">
				<div className="w-full">
					<Statistics player={player} items={items} />
				</div>

				<div className="w-full">
					<Gear player={player} />
				</div>
			</div>

			<h1 className="mb-8">Inventory</h1>
			<Inventory inventoryItems={player.items} nonInteractive={nonInteractive} shopItems={items} />

			<h1 className="mt-24 mb-8">Storyline</h1>
			<StoryLine player={player} />
		</div>
	);
};

export default ProfileScreen;
