import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import App from './App';
import Admin from './Admin';
import RemovedResourcePage from './removedResources/RemovedResourcePage';
import Login from '../user/Login';
import Ontology from '../fields/ontology/Ontology';
import PrivateRoute from './PrivateRoute';

const Routes = () => (
    <App>
        <Route path="/" exact render={() => <Redirect to="/dashboard" />} />
        <PrivateRoute path="/dashboard" component={Admin} />
        <PrivateRoute path="/removed" component={RemovedResourcePage} />
        <PrivateRoute path="/ontology" component={Ontology} />
        <Route path="/login" exact component={Login} />
    </App>
);

export default Routes;
