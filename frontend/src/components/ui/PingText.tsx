import { ReactElement } from 'react';

type Props = {
	text: string;
};

const PingText = ({ text }: Props): ReactElement => {
	return (
		<span>
			<span className="animate-ping absolute">{text}</span>
			<span className="relative inline-flex">{text}</span>
		</span>
	);
};

export default PingText;
