import React from 'react';

import {
    Route,
    useRouteMatch,
    Redirect,
    Switch,
    useParams,
} from 'react-router';

import withInitialData from './withInitialData';
import { AddSubresource } from './subresource/AddSubresource';
import { EditSubresource } from './subresource/EditSubresource';
import { SCOPE_DOCUMENT } from '../../../common/scope';
import { FieldsEdit } from './field/FieldsEdit';
import FieldEditForm from '../fields/wizard';
import SubresourceListConnected from './subresource/SubresourceList';

const DisplayRouteComponent = () => {
    // @ts-expect-error TS2339
    const { filter } = useParams();
    const { url, path } = useRouteMatch();

    const pageComponent = <FieldsEdit filter={filter} />;

    if (filter === SCOPE_DOCUMENT) {
        return (
            <Switch>
                <Route exact path={`${path}/main`}>
                    {pageComponent}
                </Route>
                <Route exact path={`${path}/main/edit/:fieldName?`}>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <FieldEditForm filter={filter} />
                </Route>
                <Route exact path={`${path}/subresource`}>
                    <SubresourceListConnected />
                </Route>
                <Route exact path={`${path}/subresource/add`}>
                    <AddSubresource />
                </Route>
                <Route exact path={`${path}/subresource/:subresourceId`}>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <EditSubresource filter={filter} />
                </Route>
                <Route
                    exact
                    path={`${path}/subresource/:subresourceId/edit/:fieldName?`}
                >
                    {/*
                     // @ts-expect-error TS2322 */}
                    <FieldEditForm filter={filter} />
                </Route>
                <Route>
                    <Redirect to={`${url}/main`} />
                </Route>
            </Switch>
        );
    }

    return (
        <Switch>
            <Route exact path={`${path}/edit/:fieldName?`}>
                {/*
                 // @ts-expect-error TS2322 */}
                <FieldEditForm filter={filter} />
            </Route>
            <Route>{pageComponent}</Route>
        </Switch>
    );
};

export const DisplayRoute = withInitialData(DisplayRouteComponent);
