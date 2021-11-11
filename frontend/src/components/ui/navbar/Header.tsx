import { ReactElement, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import logo from '../../../assets/ui/logo-sm.png';
import { PlayerContext } from '../../../contexts/playerContext';
import { isInBattle } from '../../../utils/validation';
import PingText from '../PingText';
import PixelatedImage from '../PixelatedImage';
import DropDown from './DropDown';

export const MenuButton = ({
	onClick,
	children,
	disabled,
}: {
	onClick: () => void;
	children: string | ReactElement | ReactElement[];
	disabled?: boolean;
}) => (
	<button
		onClick={onClick}
		disabled={disabled}
		className={`my-auto pb-0 ml-8 uppercase tracking-widest align-middle text-yellow-300 hover:text-indigo-300 `}
	>
		{children}
	</button>
);

type Props = {
	disableNavBar?: boolean;
};

const Header = ({ disableNavBar }: Props): ReactElement => {
	const history = useHistory();
	const context = useContext(PlayerContext);
	const location = useLocation();

	const handleClick = (path: string) => {
		history.push(path);
	};

	const handleLogOut = () => {
		context.signOut();
		history.push('/');
	};

	const isLoggedIn = context.playerCredentials && context.playerAccount;
	const shouldReturnToBattle = isLoggedIn && isInBattle(context.playerAccount!.rpg) && location.pathname !== '/battle';

	return (
		<div className="h-16 bg-gray-900 flex px-8">
			<MenuButton disabled={disableNavBar} onClick={() => handleClick('/')}>
				<PixelatedImage src={logo} alt="logo" className="h-6 " />
			</MenuButton>
			{shouldReturnToBattle ? (
				<Link className="my-auto pb-0 ml-8 uppercase tracking-widest align-middle text-red-500" to="/battle">
					<PingText text="Return to fight" />
				</Link>
			) : (
				<MenuButton disabled={disableNavBar} onClick={() => handleClick('/hunt')}>
					Go Huntin'
				</MenuButton>
			)}
			<MenuButton disabled={disableNavBar} onClick={() => handleClick('/afterlife')}>
				Afterlife
			</MenuButton>
			<MenuButton disabled={disableNavBar} onClick={() => handleClick('/shop')}>
				Shop
			</MenuButton>{' '}
			<MenuButton disabled={disableNavBar} onClick={() => handleClick('/leaderboards')}>
				Leaderboards
			</MenuButton>
			<button className="my-auto pb-0 ml-8 uppercase tracking-widest align-middle text-yellow-300 hover:text-indigo-300"></button>
			<div className="flex-1"></div>
			{isLoggedIn ? (
				<>
					<MenuButton disabled={disableNavBar} onClick={() => handleClick('/my-profile')}>
						{context.playerAccount!?.rpg.name || 'Profile'}
					</MenuButton>
					<MenuButton disabled={disableNavBar} onClick={handleLogOut}>
						Sign Out
					</MenuButton>
				</>
			) : (
				<>
					<MenuButton disabled={disableNavBar} onClick={() => handleClick('/register')}>
						Register
					</MenuButton>
					<MenuButton disabled={disableNavBar} onClick={() => handleClick('/sign-in')}>
						Sign In
					</MenuButton>
				</>
			)}
			<DropDown />
		</div>
	);
};

export default Header;
