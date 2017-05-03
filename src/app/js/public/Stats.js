import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';

import { fromDataset } from './selectors';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    col: {
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
    },
    separator: {
        margin: '24px',
    },
    nb: {
        fontWeight: 'bold',
    },
};

export const StatsComponent = ({ nbColumns, nbResources, p: polyglot }) => (
    <ToolbarGroup>
        <div style={styles.col}>
            <div>{polyglot.t('columns')}</div>
            <div style={styles.nb}>{nbColumns}</div>
        </div>
        <ToolbarSeparator style={styles.separator} />
        <div style={styles.col}>
            <div>{polyglot.t('resources')}</div>
            <div style={styles.nb}>{nbResources}</div>
        </div>
    </ToolbarGroup>
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

export default compose(
    connect(mapStateToProps),
    translate,
)(StatsComponent);
