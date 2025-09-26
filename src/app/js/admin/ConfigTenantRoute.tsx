import React from 'react';

import withInitialData from './withInitialData';

// @ts-expect-error TS7016
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
