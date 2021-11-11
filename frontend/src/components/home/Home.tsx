import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import Logo from './Logo';

const Home = (): ReactElement => {
	const renderAction = (text: string, linkText: string, linkPath: string) => (
		<div className="mb-6">
			<div>{text}</div>

			<div className="animate-pulse">
				<Link to={linkPath}>{linkText}</Link>
			</div>
		</div>
	);

	return (
		<div className="flex h-full">
			<div className="text-center m-auto">
				<Logo />
				<div className="text-xxs mt-4 mb-24">
					<span className="opacity-50">v0.4.0 ({process.env.REACT_APP_GIT_SHA}) - created by lemii</span> <br />
				</div>

				<div className="flex justify-center gap-32">
					<div>
						{renderAction('New player?', 'Register here', '/register')}
						{renderAction('Get to know legends?', 'View leaderboards', '/leaderboards')}
						{renderAction('Learn about history?', 'View afterlife', '/afterlife')}
					</div>
					<div>
						{renderAction('Returning adventurer?', 'Sign in', '/sign-in')}
						{renderAction('Ready to start?', "Go Huntin'", '/hunt')}
						{renderAction('Low on health?', 'Head to the shop', '/shop')}
					</div>
				</div>
				{/* {renderAction('', "I DON'T GET ANY OF THIS! PLEASE HELP!", '/help')} */}
			</div>
		</div>
	);
};

export default Home;
