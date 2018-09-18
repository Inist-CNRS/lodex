import React from 'react';
import { Route } from 'react-router-dom';

import App from './App';
import Home from './Home';
import Resource from './resource/Resource';
import Login from '../user/Login';
import GraphPage from './graph/GraphPage';

const Routes = () => (
    <App>
        <Route path="/" component={Home} />
        <Route path="/resource" component={Resource} />
        <Route path="/ark:/:naan/:rest" component={Resource} />
        <Route path="/uid:/:uri" component={Resource} />
        <Route path="/login" component={Login} />
        <Route path="/graph" component={GraphPage} />
        <Route path="/graph/:name" component={GraphPage} />
    </App>
);

export default Routes;
