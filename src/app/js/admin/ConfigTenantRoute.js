import React from 'react';

import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';
import withInitialData from './withInitialData';

import { Route, useRouteMatch, Switch } from 'react-router';
import ConfigTenantFormComposed from './configTenant/ConfigTenantForm';

export const ConfigTenantRouteComponent = () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <ConfigTenantFormComposed />
            </Route>
        </Switch>
    );
};

export const ConfigTenantRoute = compose(
    withInitialData,
    translate,
)(ConfigTenantRouteComponent);
