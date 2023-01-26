import React from 'react';

import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';
import withInitialData from './withInitialData';

import { Route, useRouteMatch, Switch } from 'react-router';
import EnrichmentForm from './enrichment/EnrichmentForm';
import EnrichmentSelect from './enrichment/EnrichmentSelect';
import EnrichmentListConnected from './enrichment/EnrichmentList';

export const EnrichmentRouteComponent = () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <EnrichmentListConnected />
            </Route>
            <Route exact path={`${path}/add`}>
                <EnrichmentForm />
            </Route>
            <Route exact path={`${path}/:enrichmentId`}>
                <EnrichmentForm isEdit />
            </Route>
            <Route>
                <EnrichmentSelect />
            </Route>
        </Switch>
    );
};

export const EnrichmentRoute = compose(
    withInitialData,
    translate,
)(EnrichmentRouteComponent);
