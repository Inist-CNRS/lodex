import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PublicationPreview from './preview/publication/PublicationPreview';
import Statistics from './Statistics';
import { fromPublication } from './selectors';
import Ontology from '../fields/ontology/Ontology';
import ModelMenu from './Appbar/ModelMenu';

const DisplayComponent = ({ hasPublishedDataset }) => {
    if (hasPublishedDataset) {
        return <Ontology />;
    }

    return (
        <div>
            <ModelMenu hasPublishedDataset={hasPublishedDataset} />
            <PublicationPreview />
            <Statistics mode="display" />
        </div>
    );
};

DisplayComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

export const Display = connect(mapStateToProps)(DisplayComponent);
