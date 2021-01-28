import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { fromParsing, fromPublicationPreview } from './selectors';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';
import theme from './../theme';
import { SCOPE_COLLECTION, SCOPE_DOCUMENT } from '../../../common/scope';

const useStyles = makeStyles({
    progress: {
        visibility: 'visible',
    },
    notProgress: {
        visibility: 'hidden',
    },
    container: {
        height: 30,
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
        lineHeight: '30px',
        height: '100%',
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

const mapStateToProps = (state, { filter, fields }) => ({
    isComputing: fromPublicationPreview.isComputing(state),
    totalLoadedColumns: fromParsing.getParsedExcerptColumns(state).length,
    totalLoadedLines: fromParsing.getTotalLoadedLines(state),
    totalPublishedFields: (fields || fromFields.getFields(state)).filter(f => {
        if (!filter) {
            return true;
        }

        return filter === SCOPE_DOCUMENT
            ? (f.scope === SCOPE_COLLECTION || f.scope === SCOPE_DOCUMENT) &&
                  !f.subresourceId
            : filter === f.subresourceId
            ? (f.scope === SCOPE_COLLECTION || f.scope === SCOPE_DOCUMENT) &&
              filter === f.subresourceId &&
              !(f.name.endsWith('_uri') && f.label === 'uri')
            : f.scope === filter;
    }).length,
});

export default compose(
    connect(mapStateToProps),
    translate,
)(StatisticsComponent);
