import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Box, CircularProgress } from '@mui/material';

import { fromPublicationPreview } from './selectors';
import { fromFields } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';
import customTheme from '../../custom/customTheme';

const styles = {
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
        backgroundColor: customTheme.palette.neutralDark.transparent,
        lineHeight: '30px',
        height: '100%',
        alignItems: 'center',
        display: 'flex',
    },
};

export const StatisticsComponent = ({
    isComputing,
    p: polyglot,
    totalPublishedFields,
}) => {
    return (
        <Box sx={styles.container}>
            {isComputing && (
                <CircularProgress
                    variant="indeterminate"
                    className="publication-preview-is-computing"
                    size={20}
                />
            )}
            <Box sx={styles.item}>
                {polyglot.t('publication_summary_fields', {
                    smart_count: totalPublishedFields,
                })}
            </Box>
        </Box>
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
});

export default compose(
    connect(mapStateToProps),
    translate,
)(StatisticsComponent);
