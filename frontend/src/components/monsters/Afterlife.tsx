import { ReactElement } from 'react';

import MonsterOverview from './MonsterOverview';

const Afterlife = (): ReactElement => {
	return (
		<div className="h-full">
			<MonsterOverview afterlife={true} />
		</div>
	);
};

export default Afterlife;
