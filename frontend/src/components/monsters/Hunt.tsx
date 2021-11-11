import { ReactElement } from 'react';

import MonsterOverview from './MonsterOverview';

const Hunt = (): ReactElement => {
	return (
		<div>
			<MonsterOverview afterlife={false} />
		</div>
	);
};

export default Hunt;
