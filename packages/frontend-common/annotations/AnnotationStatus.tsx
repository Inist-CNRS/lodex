import { Chip } from '@mui/material';

import { grey } from '@mui/material/colors';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { type AnnotationStatus as Status } from '@lodex/common';

interface AnnotationStatusProps {
    status?: Status;
    arialLabel?: string;
}

export const AnnotationStatusChip = ({
    status,
    arialLabel,
}: AnnotationStatusProps) => {
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
