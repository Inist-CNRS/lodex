import React from 'react';
import { Route, Redirect, Switch, useRouteMatch } from 'react-router-dom';

import App from './App';
import RemovedResourcePage from './removedResources/RemovedResourcePage';
import Login from '../user/Login';
import Ontology from '../fields/ontology/Ontology';
import PrivateRoute from './PrivateRoute';
import Data from './Data';
import Display from './Display';

const DataRoutes = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/removed`} component={RemovedResourcePage} />
            <Route exact path={path} component={Data} />
        </Switch>
    );
};

const DisplayRoutes = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path} component={Display} />
        </Switch>
    );
};

const Routes = () => (
    <App>
        <Route path="/" exact render={() => <Redirect to="/data" />} />
        <PrivateRoute path="/data" component={DataRoutes} />
        <PrivateRoute path="/display" component={DisplayRoutes} />
        <PrivateRoute path="/ontology" component={Ontology} />
        <Route path="/login" exact component={Login} />
    </App>
);

export default Routes;
