import React from 'react';
import { Route } from 'react-router-dom';

import App from './App';
import Home from './Home';
import Resource from './resource/Resource';
import Login from '../user/Login';
import GraphPage from './graph/GraphPage';
import NavBar from './NavBar';

const notLogin = new RegExp('^(?!.*(/login)).*$');

const Routes = () => (
    <App>
        <Route path={notLogin} component={NavBar} />
        <Route path="/" exact component={Home} />
        <Route path="/resource" component={Resource} />
        <Route path="/ark:/:naan/:rest" component={Resource} />
        <Route path="/uid:/:uri" component={Resource} />
        <Route path="/login" component={Login} />
        <Route path="/graph" exact component={GraphPage} />
        <Route path="/graph/:name" component={GraphPage} />
    </App>
);

export default Routes;
