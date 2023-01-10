import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { fromPublicationPreview } from './selectors';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';
import colorsTheme from '../../custom/colorsTheme';

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
        backgroundColor: colorsTheme.black.veryLight,
        lineHeight: '30px',
        height: '100%',
        alignItems: 'center',
        display: 'flex',
    },
    isPublished: {
        backgroundColor: colorsTheme.green.tertiary,
    },
    toggle: {
        cursor: 'pointer',
    },
});

export const StatisticsComponent = ({
    isComputing,
    p: polyglot,
    totalPublishedFields,
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
            <div className={classes.item}>
                {polyglot.t('publication_summary_fields', {
                    smart_count: totalPublishedFields,
                })}
            </div>
        </div>
    );
};

StatisticsComponent.propTypes = {
    isComputing: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    totalPublishedFields: PropTypes.number.isRequired,
};

const mapStateToProps = (state, { filter, subresourceId }) => ({
    isComputing: fromPublicationPreview.isComputing(state),
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
