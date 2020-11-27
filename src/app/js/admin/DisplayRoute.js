import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import {
    Route,
    useRouteMatch,
    Redirect,
    Switch,
    useParams,
} from 'react-router';

import PublicationPreview from './preview/publication/PublicationPreview';
import Statistics from './Statistics';
import { fromPublication, fromParsing } from './selectors';
import Ontology from '../fields/ontology/Ontology';
import ModelMenu from './Appbar/ModelMenu';
import ParsingResult from './parsing/ParsingResult';
import withInitialData from './withInitialData';
import { AddSubresource } from './subresource/AddSubresource';
import { EditSubresource } from './subresource/EditSubresource';

const DisplayRouteComponent = ({ showAddColumns, hasPublishedDataset }) => {
    const { filter } = useParams();
    const { url, path } = useRouteMatch();

    const pageComponent = hasPublishedDataset ? (
        <Ontology filter={filter} />
    ) : (
        <div>
            <ModelMenu hasPublishedDataset={hasPublishedDataset} />
            <div style={{ paddingBottom: 30 }}>
                <div style={{ display: showAddColumns ? 'block' : 'none' }}>
                    <ParsingResult showAddColumns maxLines={3} />
                </div>
                {showAddColumns && (
                    <Statistics mode="display" filter={filter} />
                )}
                <PublicationPreview filter={filter} />
                {!showAddColumns && (
                    <Statistics mode="display" filter={filter} />
                )}
            </div>
        </div>
    );

    if (filter === 'document') {
        return (
            <Switch>
                <Route exact path={`${path}/main`}>
                    <div>{pageComponent}</div>
                </Route>
                <Route exact path={`${path}/add`}>
                    <AddSubresource />
                </Route>
                <Route exact path={`${path}/:resourceId`}>
                    <EditSubresource />
                </Route>
                <Route>
                    <Redirect to={`${url}/main`} />
                </Route>
            </Switch>
        );
    }

    return pageComponent;
};

DisplayRouteComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
    showAddColumns: PropTypes.bool.isRequired,
    filter: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    showAddColumns: fromParsing.showAddColumns(state),
});

export const DisplayRoute = compose(
    withInitialData,
    connect(mapStateToProps),
)(DisplayRouteComponent);
