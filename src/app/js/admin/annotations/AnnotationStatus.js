import { Chip } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { grey } from '@mui/material/colors';
import { useTranslate } from '../../i18n/I18NContext';
import { statuses } from '../../../../common/validator/annotation.validator';

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
        case 'parking':
            return (
                <Chip
                    aria-label={arialLabel}
                    color="default"
                    sx={{ backgroundColor: grey[900], color: 'white' }}
                    label={translate('annotation_status_parking')}
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
