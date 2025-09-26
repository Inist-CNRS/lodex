import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router';

import { DisplayRoute } from './DisplayRoute';
import SearchFormConnected from './Search/SearchForm';

const DisplayComponent = () => {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}/search`}>
                <SearchFormConnected />
            </Route>
            <Route path={`${path}/:filter`}>
                <DisplayRoute />
            </Route>
            <Route
                path={path}
                exact
                render={() => <Redirect to={`${path}/dataset`} />}
            />
        </Switch>
    );
};

export const Display = DisplayComponent;
