import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { fromParsing, fromPublicationPreview } from './selectors';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';
import theme from './../theme';

const useStyles = makeStyles({
    progress: {
        visibility: 'visible',
    },
    notProgress: {
        visibility: 'hidden',
    },
    container: {
        height: 72,
        alignItems: 'center',
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 2,
    },
    item: {
        paddingLeft: '1rem',
        paddingRight: '1rem',
        backgroundColor: theme.black.veryLight,
    },
});

export const StatisticsComponent = ({
    isComputing,
    p: polyglot,
    totalLoadedColumns,
    totalLoadedLines,
    totalPublishedFields,
    mode = 'data',
}) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <CircularProgress
                variant="indeterminate"
                className={classnames(
                    {
                        [classes.progress]: isComputing,
                        [classes.notProgress]: !isComputing,
                    },
                    'publication-preview-is-computing',
                )}
                size={20}
            />
            {mode === 'data' ? (
                <>
                    <div className={classes.item}>
                        {polyglot.t('parsing_summary_lines', {
                            smart_count: totalLoadedLines,
                        })}
                    </div>
                    <div className={classes.item}>
                        {polyglot.t('parsing_summary_columns', {
                            smart_count: totalLoadedColumns,
                        })}
                    </div>
                </>
            ) : (
                <div className={classes.item}>
                    {polyglot.t('publication_summary_fields', {
                        smart_count: totalPublishedFields,
                    })}
                </div>
            )}
        </div>
    );
};

StatisticsComponent.propTypes = {
    isComputing: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    totalLoadedColumns: PropTypes.number.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    totalPublishedFields: PropTypes.number.isRequired,
    mode: PropTypes.oneOf(['data', 'display']),
};

const mapStateToProps = (state, { filter }) => ({
    isComputing: fromPublicationPreview.isComputing(state),
    totalLoadedColumns: fromParsing.getParsedExcerptColumns(state).length,
    totalLoadedLines: fromParsing.getTotalLoadedLines(state),
    totalPublishedFields: fromFields.getFields(state).filter(f => {
        if (!filter) {
            return true;
        }
        return filter === 'document'
            ? (f.cover === 'collection' || f.cover === 'document') &&
                  !f.display_in_graph
            : filter === 'graph'
            ? f.display_in_graph
            : f.cover === 'dataset' && !f.display_in_graph;
    }).length,
});

export default compose(
    connect(mapStateToProps),
    translate,
)(StatisticsComponent);
