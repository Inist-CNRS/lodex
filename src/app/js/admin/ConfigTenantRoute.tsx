// @ts-expect-error TS6133
import React from 'react';

import withInitialData from './withInitialData';

import { Route, useRouteMatch, Switch } from 'react-router';
import ConfigTenantFormComposed from './configTenant/ConfigTenantForm';

export const ConfigTenantRouteComponent = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <ConfigTenantFormComposed />
            </Route>
        </Switch>
    );
};

export const ConfigTenantRoute = withInitialData(ConfigTenantRouteComponent);
