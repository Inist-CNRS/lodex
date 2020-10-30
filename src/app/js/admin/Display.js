import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PublicationPreview from './preview/publication/PublicationPreview';
import Statistics from './Statistics';
import { fromPublication, fromParsing } from './selectors';
import Ontology from '../fields/ontology/Ontology';
import ModelMenu from './Appbar/ModelMenu';
import ParsingResult from './parsing/ParsingResult';
import { compose } from 'recompose';
import withInitialData from './withInitialData';

const DisplayComponent = ({ showAddColumns, hasPublishedDataset }) => {
    if (hasPublishedDataset) {
        return <Ontology />;
    }

    return (
        <div>
            <ModelMenu hasPublishedDataset={hasPublishedDataset} />
            <div style={{ paddingBottom: 30 }}>
                <div style={{ display: showAddColumns ? 'block' : 'none' }}>
                    <ParsingResult showAddColumns maxLines={3} />
                </div>
                {showAddColumns && <Statistics mode="display" />}
                <PublicationPreview />
                {!showAddColumns && <Statistics mode="display" />}
            </div>
        </div>
    );
};

DisplayComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
    showAddColumns: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    showAddColumns: fromParsing.showAddColumns(state),
});

export const Display = compose(
    withInitialData,
    connect(mapStateToProps),
)(DisplayComponent);
