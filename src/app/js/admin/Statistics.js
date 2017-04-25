import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';
import CircularProgress from 'material-ui/CircularProgress';

import { fromParsing, fromFields, fromPublicationPreview } from './selectors';
import { polyglot as polyglotPropTypes } from '../propTypes';
import ActionButton from './ActionButton';
import { addField } from '../fields';
import { showAddColumns, hideAddColumns } from './parsing';

const styles = {
    progress: memoize(isComputing => ({
        visibility: isComputing ? 'visible' : 'hidden',
    })),
    container: {
        alignItems: 'center',
        paddingTop: '0.5rem',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 2,
    },
    item: {
        marginLeft: '1rem',
        marginRight: '1rem',
    },
    line: {
        flexGrow: 2,
        marginLeft: '1rem',
        marginRight: '1rem',
    },
};

export const StatisticsComponent = ({
    handleAddColumn,
    handleShowExistingColumns,
    handleHideExistingColumns,
    isComputing,
    p: polyglot,
    totalLoadedColumns,
    totalLoadedLines,
    totalPublishedColumns,
}) => (
    <div style={styles.container}>
        <hr style={styles.line} />
        <CircularProgress
            className="publication-preview-is-computing"
            style={styles.progress(isComputing)}
            size={20}
        />
        <div style={styles.item}>{polyglot.t('parsing_summary', { count: totalLoadedLines })}</div>
        <div style={styles.item}>{polyglot.t('parsing_summary_columns', { count: totalLoadedColumns })}</div>
        <div style={styles.item}>{polyglot.t('publication_summary_columns', { count: totalPublishedColumns })}</div>
        <hr style={styles.line} />

        <ActionButton
            onAddNewColumn={handleAddColumn}
            onShowExistingColumns={handleShowExistingColumns}
            onHideExistingColumns={handleHideExistingColumns}
        />
    </div>
);

StatisticsComponent.propTypes = {
    handleAddColumn: PropTypes.func.isRequired,
    handleShowExistingColumns: PropTypes.func.isRequired,
    handleHideExistingColumns: PropTypes.func.isRequired,
    isComputing: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    totalLoadedColumns: PropTypes.number.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    totalPublishedColumns: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    isComputing: fromPublicationPreview.isComputing(state),
    totalLoadedColumns: fromParsing.getParsedExcerptColumns(state).length,
    totalLoadedLines: fromParsing.getTotalLoadedLines(state),
    totalPublishedColumns: fromFields.getFields(state).length,
});

const mapDispatchToProps = ({
    handleAddColumn: addField,
    handleShowExistingColumns: showAddColumns,
    handleHideExistingColumns: hideAddColumns,
});


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(StatisticsComponent);
