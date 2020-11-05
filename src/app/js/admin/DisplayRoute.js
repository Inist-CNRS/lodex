import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PublicationPreview from './preview/publication/PublicationPreview';
import Statistics from './Statistics';
import { fromPublication, fromParsing } from './selectors';
import Ontology from '../fields/ontology/Ontology';
import ModelMenu from './Appbar/ModelMenu';
import ParsingResult from './parsing/ParsingResult';
import withInitialData from './withInitialData';

const DisplayRouteComponent = ({
    filter,
    showAddColumns,
    hasPublishedDataset,
}) => {
    if (hasPublishedDataset) {
        return <Ontology filter={filter} />;
    }

    return (
        <div>
            <ModelMenu hasPublishedDataset={hasPublishedDataset} />
            <div style={{ paddingBottom: 30 }}>
                <div style={{ display: showAddColumns ? 'block' : 'none' }}>
                    <ParsingResult showAddColumns maxLines={3} />
                </div>
                {showAddColumns && <Statistics mode="display" />}
                <PublicationPreview filter={filter} />
                {!showAddColumns && <Statistics mode="display" />}
            </div>
        </div>
    );
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
