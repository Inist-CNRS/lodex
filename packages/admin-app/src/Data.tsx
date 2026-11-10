import { Switch, Route, useRouteMatch, Redirect } from 'react-router';

import { DataRoute } from './data/DataRoute';
import { DataAddRoute } from './data/DataAddRoute';
import RemovedResourcePage from './removedResources/RemovedResourcePage';
import { EnrichmentRoute } from './EnrichmentRoute';
import { PrecomputedRoute } from './PrecomputedRoute';
import { SiteWizardHost } from './siteWizard/SiteWizardHost';

const DataComponent = () => {
    const { path } = useRouteMatch();
    const isExistingDataScreen = !!useRouteMatch(`${path}/existing`);
    return (
        <SiteWizardHost active={isExistingDataScreen}>
            <Switch>
                <Route
                    path={`${path}/existing`}
                    component={() => <DataRoute />}
                />
                <Route
                    path={`${path}/add`}
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
        </SiteWizardHost>
    );
};

export const Data = DataComponent;
