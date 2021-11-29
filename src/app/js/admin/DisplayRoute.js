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
import { FieldsEdit } from './FieldsEdit';
import { AddFieldButton } from './Appbar/AddFieldButton';

const DisplayRouteComponent = () => {
    const { filter } = useParams();
    const { url, path } = useRouteMatch();

    const pageComponent = (
        <FieldsEdit filter={filter} addFieldButton={<AddFieldButton />} />
    );

    if (filter === SCOPE_DOCUMENT) {
        return (
            <Switch>
                <Route exact path={`${path}/main`}>
                    <div>{pageComponent}</div>
                </Route>
                <Route exact path={`${path}/add`}>
                    <AddSubresource />
                </Route>
                <Route exact path={`${path}/:subresourceId`}>
                    <EditSubresource filter={filter} />
                </Route>
                <Route>
                    <Redirect to={`${url}/main`} />
                </Route>
            </Switch>
        );
    }

    return pageComponent;
};

export const DisplayRoute = withInitialData(DisplayRouteComponent);
