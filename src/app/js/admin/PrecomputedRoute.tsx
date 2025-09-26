import React from 'react';

import withInitialData from './withInitialData';

// @ts-expect-error TS7016
import { Route, useRouteMatch, Switch } from 'react-router';
import PrecomputedListConnected from './precomputed/PrecomputedList';
import PrecomputedFormConnected from './precomputed/PrecomputedForm';

export const PrecomputedRouteComponent = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <PrecomputedListConnected />
            </Route>
            <Route exact path={`${path}/add`}>
                <PrecomputedFormConnected />
            </Route>
            <Route exact path={`${path}/:precomputedId`}>
                <PrecomputedFormConnected />
            </Route>
        </Switch>
    );
};

export const PrecomputedRoute = withInitialData(PrecomputedRouteComponent);
