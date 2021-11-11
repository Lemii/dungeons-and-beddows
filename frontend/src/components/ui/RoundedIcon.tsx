import { ReactElement } from 'react';

type Props = {
	text: string;
};

const RoundedIcon = ({ text }: Props): ReactElement => {
	return (
		<div className="rounded-full flex justify-center items-center text-xxs bg-indigo-500 text-white ml-1">{text}</div>
	);
};

export default RoundedIcon;
