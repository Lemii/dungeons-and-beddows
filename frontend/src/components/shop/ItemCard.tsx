import { ReactElement } from 'react';

type Props = {
	children: ReactElement | ReactElement[];
	onClick?: () => void;
	nonInteractive?: boolean;
};

const ItemCard = ({ children, onClick, nonInteractive }: Props): ReactElement => {
	return (
		<div
			className={`custom-rounded-sm w-full h-full bg-gray-500 ${
				!nonInteractive && 'scale-animated hover:bg-purple-400 cursor-pointer'
			}`}
			onClick={onClick}
		>
			{children}
		</div>
	);
};

export default ItemCard;
