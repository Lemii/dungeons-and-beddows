import { ReactElement } from 'react';

type Props = {
	color?: 'green' | 'red' | 'blue';
	currentValue: number;
	maxValue: number;
	unit: string;
};

const ProgressBar = ({ color = 'red', currentValue, maxValue, unit }: Props): ReactElement => {
	const getPercentage = (currentValue: number, maxValue: number) => {
		return Math.round((currentValue / maxValue) * 100);
	};

	return (
		<div>
			<div className="relative pt-1">
				<div className="absolute  left-1/2 transform -translate-x-1/2">
					<div>
						{currentValue} / {maxValue} {unit}
					</div>
				</div>
			</div>
			<div className={`text-xxs overflow-hidden h-5 mb-0 text-xs flex rounded bg-${color}-200`}>
				<div
					style={{ width: `${getPercentage(currentValue, maxValue)}%` }}
					className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${color}-500`}
				></div>
			</div>
		</div>
	);
};

export default ProgressBar;
