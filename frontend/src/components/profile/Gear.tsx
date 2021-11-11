import { ReactElement } from 'react';

import useShopItems from '../../hooks/useShopItems';
import { getIcon } from '../../icons';
import { Armor, Player, Weapon } from '../../types';
import PixelatedImage from '../ui/PixelatedImage';

type GearPieceProps = {
	item?: Weapon | Armor;
};

const GearPiece = ({ item }: GearPieceProps) => {
	return (
		// <div className="w-full border-2 border-indigo-300 bg-gray-500 custom-rounded-sm h-full">
		<div className="flex h-full m-auto justify-center align-middle border-2 border-indigo-300 bg-gray-500 custom-rounded-sm ">
			{item ? (
				<PixelatedImage src={getIcon(item.id)} alt={item.name} className="w-3/4" />
			) : (
				<div className="text-gray-400 m-auto">No Item</div>
			)}
		</div>
	);
};

type GearProps = {
	player: Player;
};

const Gear = ({ player }: GearProps): ReactElement => {
	const { items } = useShopItems();
	const renderLabel = (text: string) => <div className="text-xxs text-center mt-1">{text}</div>;

	return (
		<div className="bg-gray-700 custom-rounded-sm h-full">
			<div className="grid grid-cols-2 grid-rows-2 gap-8 h-full">
				<div className="p-2 ">
					{<GearPiece item={items.weapons.find(i => i.id === player.gear.weapon)} />} {renderLabel('Weapon')}
				</div>
				<div className="p-2">
					{<GearPiece item={items.armor.find(i => i.id === player.gear.head)} />} {renderLabel('Head')}
				</div>
				<div className="p-2">
					{<GearPiece item={items.armor.find(i => i.id === player.gear.feet)} />} {renderLabel('Feet')}
				</div>
				<div className="p-2">
					{<GearPiece item={items.armor.find(i => i.id === player.gear.body)} />} {renderLabel('Body')}
				</div>
			</div>
		</div>
	);
};

export default Gear;
