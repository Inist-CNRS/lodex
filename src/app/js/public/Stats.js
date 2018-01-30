import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { fromDataset } from './selectors';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    nb: {
        fontWeight: 'bold',
    },
};

export const StatsComponent = ({
    nbResources,
    currentNbResources,
    p: polyglot,
}) => (
    <div style={styles.nb}>
        {polyglot.t('resources_found', {
            current: currentNbResources,
            total: nbResources,
        })}
    </div>
);

StatsComponent.propTypes = {
    nbColumns: PropTypes.number.isRequired,
    nbResources: PropTypes.number.isRequired,
    currentNbResources: PropTypes.number.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    nbColumns: fromFields.getNbColumns(state),
    currentNbResources: fromDataset.getDatasetTotal(state),
    nbResources: fromDataset.getDatasetFullTotal(state),
});

export default compose(connect(mapStateToProps), translate)(StatsComponent);
