import { ReactElement } from 'react';

import logo from '../../assets/ui/logo.png';

const Logo = (): ReactElement => {
	return (
		<div className="text-indigo-400">
			<img src={logo} alt="logo" className="w-full max-w-4xl" />
			{/* <div className="text-6xl mb-2">PLACEHOLDER</div>
			<div className="text-2xl">An RPG Game</div> */}
		</div>
	);
};

export default Logo;
