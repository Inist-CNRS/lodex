// @ts-expect-error TS6133
import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router';

import { DataRoute } from './DataRoute';
import { DataAddRoute } from './DataAddRoute';
import RemovedResourcePage from './removedResources/RemovedResourcePage';
import { EnrichmentRoute } from './EnrichmentRoute';
import { PrecomputedRoute } from './PrecomputedRoute';

const DataComponent = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route
                path={`${path}/existing`}
                exact
                component={() => <DataRoute />}
            />
            <Route
                path={`${path}/add`}
                exact
                component={() => <DataAddRoute />}
            />
            <Route
                path={`${path}/removed`}
                exact
                component={() => <RemovedResourcePage />}
            />
            <Route
                path={`${path}/enrichment`}
                component={() => <EnrichmentRoute />}
            />
            <Route
                path={`${path}/precomputed`}
                component={() => <PrecomputedRoute />}
            />
            <Route
                path={path}
                exact
                render={() => <Redirect to={`${path}/existing`} />}
            />
        </Switch>
    );
};

export const Data = DataComponent;
