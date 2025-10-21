import withInitialData from './withInitialData';

import { Route, useRouteMatch, Switch } from 'react-router';
import EnrichmentListConnected from './enrichment/EnrichmentList';
import EnrichmentFormConnected from './enrichment/EnrichmentForm';

export const EnrichmentRouteComponent = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}`}>
                <EnrichmentListConnected />
            </Route>
            <Route exact path={`${path}/add`}>
                <EnrichmentFormConnected />
            </Route>
            <Route exact path={`${path}/:enrichmentId`}>
                <EnrichmentFormConnected />
            </Route>
        </Switch>
    );
};

export const EnrichmentRoute = withInitialData(EnrichmentRouteComponent);
