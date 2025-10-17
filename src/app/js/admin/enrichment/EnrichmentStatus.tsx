import { connect } from 'react-redux';
import { fromEnrichments } from '../selectors';
import { Chip } from '@mui/material';
import {
    FINISHED,
    IN_PROGRESS,
    PENDING,
    ERROR,
    CANCELED,
    PAUSED,
} from '../../../../common/taskStatus';
import { useTranslate } from '../../i18n/I18NContext';
import type { State } from '../reducers';

type EnrichmentStatusProps = {
    status:
        | 'IN_PROGRESS'
        | 'PENDING'
        | 'FINISHED'
        | 'CANCELED'
        | 'ERROR'
        | 'PAUSED'
        | '';
};

export const EnrichmentStatus = ({ status }: EnrichmentStatusProps) => {
    const { translate } = useTranslate();
    if (status === PENDING) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_pending')}
                color="warning"
            />
        );
    }
    if (status === IN_PROGRESS) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_running')}
                color="info"
            />
        );
    }

    if (status === PAUSED) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_paused')}
                color="info"
            />
        );
    }

    if (status === FINISHED) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_done')}
                color="success"
            />
        );
    }

    if (status === ERROR) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_error')}
                color="error"
            />
        );
    }

    if (status === CANCELED) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_canceled')}
                color="warning"
            />
        );
    }

    return (
        <Chip
            component="span"
            label={translate('enrichment_status_not_started')}
            sx={{ backgroundColor: 'neutral' }}
        />
    );
};

const mapStateToProps = (
    state: State,
    {
        id,
    }: {
        id: string;
    },
): EnrichmentStatusProps => ({
    status: fromEnrichments.enrichments(state).find(({ _id }) => _id === id)
        ?.status as EnrichmentStatusProps['status'],
});

export default connect(mapStateToProps)(EnrichmentStatus);
