import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Stats from '../Stats';

import { fromSearch } from '../selectors';

export const StatsComponent = ({ nbResources, currentNbResources }) => (
    <Stats currentNbResources={currentNbResources} nbResources={nbResources} />
);

StatsComponent.propTypes = {
    nbResources: PropTypes.number.isRequired,
    currentNbResources: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    currentNbResources: fromSearch.getDatasetTotal(state),
    nbResources: fromSearch.getDatasetFullTotal(state),
});

export default connect(mapStateToProps)(StatsComponent);
