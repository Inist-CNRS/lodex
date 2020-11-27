import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';
import { CircularProgress } from '@material-ui/core';

import { fromParsing, fromPublicationPreview } from './selectors';
import { fromFields } from '../sharedSelectors';
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
    totalPublishedFields,
    mode = 'data',
}) => (
    <div style={styles.container}>
        <hr style={styles.line} />
        <CircularProgress
            variant="indeterminate"
            className="publication-preview-is-computing"
            style={styles.progress(isComputing)}
            size={20}
        />
        {mode === 'data' ? (
            <>
                <div style={styles.item}>
                    {polyglot.t('parsing_summary_lines', {
                        smart_count: totalLoadedLines,
                    })}
                </div>
                <div style={styles.item}>
                    {polyglot.t('parsing_summary_columns', {
                        smart_count: totalLoadedColumns,
                    })}
                </div>
            </>
        ) : (
            <div style={styles.item}>
                {polyglot.t('publication_summary_fields', {
                    smart_count: totalPublishedFields,
                })}
            </div>
        )}
        <hr style={styles.line} />
        {mode === 'display' && (
            <ActionButton
                onAddNewColumn={handleAddColumn}
                onShowExistingColumns={handleShowExistingColumns}
                onHideExistingColumns={handleHideExistingColumns}
            />
        )}
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
    totalPublishedFields: PropTypes.number.isRequired,
    mode: PropTypes.oneOf(['data', 'display']),
    filter: PropTypes.string,
};

const mapStateToProps = (state, { filter }) => ({
    isComputing: fromPublicationPreview.isComputing(state),
    totalLoadedColumns: fromParsing.getParsedExcerptColumns(state).length,
    totalLoadedLines: fromParsing.getTotalLoadedLines(state),
    totalPublishedFields: fromFields.getFields(state).filter(f => {
        console.log(f);
        if (!filter) {
            return true;
        }
        return filter === 'document'
            ? f.cover === 'collection' && !f.display_in_graph
            : filter === 'graph'
            ? f.display_in_graph
            : f.cover === 'dataset' && !f.display_in_graph;
    }).length,
});

const mapDispatchToProps = {
    handleAddColumn: addField,
    handleShowExistingColumns: showAddColumns,
    handleHideExistingColumns: hideAddColumns,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(StatisticsComponent);
