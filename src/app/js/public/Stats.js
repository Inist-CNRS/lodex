import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { fromDataset } from './selectors';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    col: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    nb: {
        fontWeight: 'bold',
    },
};

export const StatsComponent = ({ nbResources, p: polyglot }) => (
    <div style={styles.col}>
        <div>{polyglot.t('resources')}</div>
        <div style={styles.nb}>{nbResources}</div>
    </div>
);

StatsComponent.propTypes = {
    nbColumns: PropTypes.number.isRequired,
    nbResources: PropTypes.number.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    nbColumns: fromFields.getNbColumns(state),
    nbResources: fromDataset.getDatasetTotal(state),
});

export default compose(connect(mapStateToProps), translate)(StatsComponent);
