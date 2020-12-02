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

const styles = {
    progress: memoize(isComputing => ({
        visibility: isComputing ? 'visible' : 'hidden',
    })),
    container: {
        height: 72,
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
    isComputing,
    p: polyglot,
    totalLoadedColumns,
    totalLoadedLines,
    totalPublishedResources,
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
                        count: totalLoadedLines,
                    })}
                </div>
                <div style={styles.item}>
                    {polyglot.t('parsing_summary_columns', {
                        count: totalLoadedColumns,
                    })}
                </div>
            </>
        ) : (
            <div style={styles.item}>
                {polyglot.t('publication_summary_resources', {
                    count: totalPublishedResources,
                })}
            </div>
        )}
        <hr style={styles.line} />
    </div>
);

StatisticsComponent.propTypes = {
    isComputing: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    totalLoadedColumns: PropTypes.number.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    totalPublishedResources: PropTypes.number.isRequired,
    mode: PropTypes.oneOf(['data', 'display']),
};

const mapStateToProps = state => ({
    isComputing: fromPublicationPreview.isComputing(state),
    totalLoadedColumns: fromParsing.getParsedExcerptColumns(state).length,
    totalLoadedLines: fromParsing.getTotalLoadedLines(state),
    totalPublishedResources: fromFields.getFields(state).length,
});

export default compose(
    connect(mapStateToProps),
    translate,
)(StatisticsComponent);
