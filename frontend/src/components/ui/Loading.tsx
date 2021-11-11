import './Loading.css';

import { ReactElement } from 'react';

type Props = {
	scale?: number;
	spinnerOnly?: boolean;
};

const Spinner = ({ scale }: { scale: number }) => <div id="loader" className={`m-auto transform scale-${scale}`} />;

const Loading = ({ scale = 100, spinnerOnly }: Props): ReactElement => {
	if (spinnerOnly) {
		return <Spinner scale={scale} />;
	}

	return (
		<div className={`flex h-full`}>
			<Spinner scale={scale} />
		</div>
	);
};

export default Loading;
