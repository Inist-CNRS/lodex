import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router';

import { DisplayRoute } from './DisplayRoute';

const DisplayComponent = () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route
                path={`${path}/home`}
                exact
                component={() => <DisplayRoute filter="dataset" />}
            />
            <Route
                path={`${path}/resource`}
                exact
                component={() => <DisplayRoute filter="document" />}
            />
            <Route
                path={`${path}/graph`}
                exact
                component={() => <DisplayRoute filter="graph" />}
            />
            <Route
                path={path}
                exact
                render={() => <Redirect to={`${path}/home`} />}
            />
        </Switch>
    );
};

export const Display = DisplayComponent;
