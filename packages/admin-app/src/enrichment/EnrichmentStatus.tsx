import { connect } from 'react-redux';
import { fromEnrichments } from '../selectors';
import { Chip } from '@mui/material';
import { TaskStatus } from '@lodex/common';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';
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
    if (status === TaskStatus.PENDING) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_pending')}
                color="warning"
            />
        );
    }
    if (status === TaskStatus.IN_PROGRESS) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_running')}
                color="info"
            />
        );
    }

    if (status === TaskStatus.PAUSED) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_paused')}
                color="info"
            />
        );
    }

    if (status === TaskStatus.FINISHED) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_done')}
                color="success"
            />
        );
    }

    if (status === TaskStatus.ERROR) {
        return (
            <Chip
                component="span"
                label={translate('enrichment_status_error')}
                color="error"
            />
        );
    }

    if (status === TaskStatus.CANCELED) {
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
