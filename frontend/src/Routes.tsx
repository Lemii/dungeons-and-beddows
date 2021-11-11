import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Battle from './components/battle/Battle';
import Home from './components/home/Home';
import Leaderboards from './components/leaderboards/Leaderboards';
import Afterlife from './components/monsters/Afterlife';
import Hunt from './components/monsters/Hunt';
import MyProfile from './components/profile/MyProfile';
import Profile from './components/profile/Profile';
import Register from './components/register/Register';
import Shop from './components/shop/Shop';
import SignIn from './components/SignIn';

const Routes: React.FC = () => {
	return (
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/hunt" component={Hunt} />
			<Route exact path="/shop" component={Shop} />
			<Route exact path="/afterlife" component={Afterlife} />
			<Route exact path="/leaderboards" component={Leaderboards} />
			<Route exact path="/sign-in" component={SignIn} />
			<Route exact path="/register" component={Register} />
			<Route path="/profile/:id" component={Profile} />
			<Route exact path="/my-profile" component={MyProfile} />
			<Route exact path="/battle" component={Battle} />
		</Switch>
	);
};

export default Routes;
