import { ReactElement } from 'react';

type Props = {
	mt?: number;
	mb?: number;
};

const Hr = ({ mt = 8, mb = 8 }: Props): ReactElement => {
	return <hr className={`mt-${mt} mb-${mb}`} />;
};

export default Hr;
