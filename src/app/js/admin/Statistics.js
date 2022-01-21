import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Box, CircularProgress } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import {
    fromParsing,
    fromPublicationPreview,
    fromEnrichments,
} from './selectors';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';
import theme from './../theme';
import { PENDING } from '../../../common/enrichmentStatus';
import { useAdminContext } from './AdminContext';

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
    itemText: {
        paddingRight: '1rem',
    },
    item: {
        paddingLeft: '1rem',
        paddingRight: '1rem',
        backgroundColor: theme.black.veryLight,
        lineHeight: '30px',
        height: '100%',
        alignItems: 'center',
        display: 'flex',
    },
    columnEnriched: {
        backgroundColor: theme.green.light,
    },
    isPublished: {
        backgroundColor: theme.green.tertiary,
    },
    toggle: {
        cursor: 'pointer',
    },
});

export const StatisticsComponent = ({
    isComputing,
    p: polyglot,
    totalLoadedColumns,
    totalLoadedEnrichmentColumns,
    totalLoadedLines,
    totalPublishedFields,
    mode = 'data',
    hasPublishedDataset,
}) => {
    const classes = useStyles();
    const adminContext = useAdminContext();
    const toggleShowEnrichmentColumns =
        adminContext?.toggleShowEnrichmentColumns;
    const showEnrichmentColumns = adminContext?.showEnrichmentColumns;
    const toggleShowMainColumns = adminContext?.toggleShowMainColumns;
    const showMainColumns = adminContext?.showMainColumns;

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
                    <div
                        className={classnames(
                            {
                                [classes.isPublished]: hasPublishedDataset,
                            },
                            classes.item,
                            'data-published-status',
                        )}
                    >
                        {hasPublishedDataset
                            ? polyglot.t('isPublished')
                            : polyglot.t('isNotPublished')}
                    </div>
                    <div className={classes.item}>
                        {polyglot.t('parsing_summary_lines', {
                            smart_count: totalLoadedLines,
                        })}
                    </div>

                    <Box
                        className={classes.item}
                        onClick={toggleShowMainColumns}
                    >
                        <div className={classes.itemText}>
                            {polyglot.t('parsing_summary_columns', {
                                smart_count:
                                    totalLoadedColumns -
                                    totalLoadedEnrichmentColumns,
                            })}
                        </div>
                        {showMainColumns ? (
                            <VisibilityIcon className={classes.toggle} />
                        ) : (
                            <VisibilityOffIcon className={classes.toggle} />
                        )}
                    </Box>

                    <Box
                        className={classnames(
                            classes.item,
                            classes.columnEnriched,
                        )}
                        onClick={toggleShowEnrichmentColumns}
                    >
                        <div className={classes.itemText}>
                            {polyglot.t('parsing_enriched_columns', {
                                smart_count: totalLoadedEnrichmentColumns,
                            })}
                        </div>
                        {showEnrichmentColumns ? (
                            <VisibilityIcon className={classes.toggle} />
                        ) : (
                            <VisibilityOffIcon className={classes.toggle} />
                        )}
                    </Box>
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
    totalLoadedEnrichmentColumns: PropTypes.number.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    totalPublishedFields: PropTypes.number.isRequired,
    mode: PropTypes.oneOf(['data', 'display']),
    hasPublishedDataset: PropTypes.bool,
};

const mapStateToProps = (state, { filter, subresourceId }) => ({
    isComputing: fromPublicationPreview.isComputing(state),
    totalLoadedColumns: fromParsing.getParsedExcerptColumns(state).length,
    totalLoadedEnrichmentColumns: fromEnrichments
        .enrichments(state)
        .filter(enrichment => enrichment.status !== PENDING).length,
    totalLoadedLines: fromParsing.getTotalLoadedLines(state),
    totalPublishedFields: fromFields.getEditingFields(state, {
        filter,
        subresourceId,
    }).length,
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(StatisticsComponent);
