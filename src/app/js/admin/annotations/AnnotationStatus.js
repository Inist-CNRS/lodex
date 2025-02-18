import { Chip } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';

export const statuses = ['to_review', 'ongoing', 'validated', 'rejected'];

export const AnnotationStatus = ({ status, arialLabel }) => {
    const { translate } = useTranslate();

    switch (status) {
        case 'to_review':
            return (
                <Chip
                    aria-label={arialLabel}
                    color="default"
                    label={translate('annotation_status_to_review')}
                />
            );
        case 'ongoing':
            return (
                <Chip
                    aria-label={arialLabel}
                    color="info"
                    label={translate('annotation_status_ongoing')}
                />
            );
        case 'validated':
            return (
                <Chip
                    aria-label={arialLabel}
                    color="success"
                    label={translate('annotation_status_validated')}
                />
            );
        case 'rejected':
            return (
                <Chip
                    aria-label={arialLabel}
                    color="error"
                    label={translate('annotation_status_rejected')}
                />
            );
        default:
            return null;
    }
};

AnnotationStatus.propTypes = {
    status: PropTypes.oneOf(statuses),
    arialLabel: PropTypes.string,
};
