import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import withInitialData from './withInitialData';

import {
    Route,
    useRouteMatch,
    Redirect,
    Switch,
    useParams,
} from 'react-router';

export const EnrichmentRouteComponent = () => {
    let { path } = useRouteMatch();
    console.log(path)
    return (
        <Switch>
            <Route exact path={`${path}/`}>
                <div>LIST</div>
            </Route>
            <Route exact path={`${path}/add`}>
                <div>ADD</div>
            </Route>
            <Route exact path={`${path}/:enrichmentId`}>
                <div>EDIT</div>
            </Route>
        </Switch>
    );
};

EnrichmentRouteComponent.propTypes = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export const EnrichmentRoute = compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(EnrichmentRouteComponent);
