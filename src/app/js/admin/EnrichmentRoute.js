import React from 'react';

import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';
import withInitialData from './withInitialData';

import { Route, useRouteMatch, Switch } from 'react-router';
import EnrichmentListConnected from './enrichment/EnrichmentList';
import EnrichmentForm2Connected from './enrichment/EnrichmentForm2';

export const EnrichmentRouteComponent = () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <EnrichmentListConnected />
            </Route>
            <Route exact path={`${path}/add`}>
                <EnrichmentForm2Connected />
            </Route>
            <Route exact path={`${path}/:enrichmentId`}>
                <EnrichmentForm2Connected />
            </Route>
        </Switch>
    );
};

export const EnrichmentRoute = compose(
    withInitialData,
    translate,
)(EnrichmentRouteComponent);
