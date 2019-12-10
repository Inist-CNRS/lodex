import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Stats from '../Stats';

import { fromDataset } from '../selectors';

export const StatsComponent = ({ nbResources, currentNbResources }) => (
    <Stats currentNbResources={currentNbResources} nbResources={nbResources} />
);

StatsComponent.propTypes = {
    nbResources: PropTypes.number.isRequired,
    currentNbResources: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    currentNbResources: fromDataset.getDatasetTotal(state),
    nbResources: fromDataset.getDatasetFullTotal(state),
});

export default connect(mapStateToProps)(StatsComponent);
