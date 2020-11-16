import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { fromParsing } from './selectors';

import { DataRoute } from './DataRoute';
import { DataAddRoute } from './DataAddRoute';
import RemovedResourcePage from './removedResources/RemovedResourcePage';

const DataComponent = ({ canUploadFile }) => {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <Route
                path={`${path}/existing`}
                exact
                component={() =>
                    canUploadFile ? <DataAddRoute /> : <DataRoute />
                }
            />
            <Route
                path={`${path}/add`}
                exact
                component={() => <DataAddRoute />}
            />
            <Route
                path={`${path}/removed`}
                exact
                component={() => <RemovedResourcePage />}
            />
            <Route
                path={path}
                exact
                render={() => <Redirect to={`${path}/existing`} />}
            />
        </Switch>
    );
};

DataComponent.propTypes = {
    canUploadFile: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    canUploadFile: fromParsing.canUpload(state),
});
export const Data = connect(mapStateToProps)(DataComponent);
