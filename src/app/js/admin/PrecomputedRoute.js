import React from 'react';

import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';
import withInitialData from './withInitialData';

import { Route, useRouteMatch, Switch } from 'react-router';
import PrecomputedListConnected from './precomputed/PrecomputedList';
import PrecomputedFormConnected from './precomputed/PrecomputedForm';

export const PrecomputedRouteComponent = () => {
    let { path } = useRouteMatch();

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

export const PrecomputedRoute = compose(
    withInitialData,
    translate,
)(PrecomputedRouteComponent);
