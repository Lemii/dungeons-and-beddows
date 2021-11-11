import { ReactElement } from 'react';

import check from '../../assets/ui/check-b.png';
import PixelatedImage from './PixelatedImage';

const Check = (): ReactElement => {
	return <PixelatedImage src={check} alt="Check" className="w-6 h-6" />;
};

export default Check;
