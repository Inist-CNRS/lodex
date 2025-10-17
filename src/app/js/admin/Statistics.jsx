import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

import { fromPublicationPreview } from './selectors';
import { fromFields } from '../sharedSelectors';
import { useTranslate } from '../i18n/I18NContext';

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
        backgroundColor: 'var(--neutral-dark-transparent)',
        lineHeight: '30px',
        height: '100%',
        alignItems: 'center',
        display: 'flex',
    },
};

export const StatisticsComponent = ({ isComputing, totalPublishedFields }) => {
    const { translate } = useTranslate();
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
                {translate('publication_summary_fields', {
                    smart_count: totalPublishedFields,
                })}
            </Box>
        </Box>
    );
};

StatisticsComponent.propTypes = {
    isComputing: PropTypes.bool.isRequired,
    totalPublishedFields: PropTypes.number.isRequired,
};

const mapStateToProps = (state, { filter, subresourceId }) => ({
    isComputing: fromPublicationPreview.isComputing(state),
    totalPublishedFields: fromFields.getEditingFields(state, {
        filter,
        subresourceId,
    }).length,
});

export default connect(mapStateToProps)(StatisticsComponent);
