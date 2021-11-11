import { ReactElement } from 'react';

type Props = {
	alt: string;
	src: string;
	className?: string;
};

const PixelatedImage = ({ src, alt, className }: Props): ReactElement => {
	return <img src={src} alt={alt} className={`pixelated ${className}`} />;
};

export default PixelatedImage;
