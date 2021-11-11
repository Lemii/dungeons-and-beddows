import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import PixelatedImage from '../ui/PixelatedImage';
import TypeWriter from './TypeWriter';

type Props = {
	title?: string;
	titleImage?: string;
	text: string;
	action?: React.ReactElement;
};

const DefaultAction = () => (
	<Link to="/hunt" className="animate-pulse">
		Continue...
	</Link>
);

const StoryScreen = ({ title, titleImage, text, action = <DefaultAction /> }: Props): ReactElement => {
	const [showAction, setShowAction] = useState(false);

	return (
		<div className="flex flex-col h-full">
			<div className="flex h-full content-center">
				<div className="m-auto w-4/5">
					{title && <h1 className="uppercase text-5xl text-center text-indigo-200">{title}</h1>}
					{titleImage && <PixelatedImage src={titleImage} alt="Title" className="m-auto max-w-full" />}

					<hr className="mb-8 mt-4" />
					<h3>
						<TypeWriter text={text} cb={() => setShowAction(true)} />

						{showAction && <div className="mt-8">{action}</div>}
					</h3>
				</div>
			</div>
		</div>
	);
};

export default StoryScreen;
