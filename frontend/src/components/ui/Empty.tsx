import { ReactElement } from 'react';

type Props = {
	text?: string;
	className?: string;
};

const Empty = ({ text, className }: Props): ReactElement => {
	return (
		<div className={`flex h-full ${className}`}>
			<div className="m-auto">
				<h3 className="text-gray-400">{text || 'Empty'}</h3>
			</div>
		</div>
	);
};

export default Empty;
