import { connect } from 'react-redux';
import { fromEnrichments } from '../selectors';
import { Chip } from '@mui/material';
import { labelByStatus } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
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

const colorByStatus: Record<
    EnrichmentStatusProps['status'],
    'default' | 'error' | 'info' | 'success' | 'warning'
> = {
    PENDING: 'warning',
    IN_PROGRESS: 'info',
    PAUSED: 'info',
    FINISHED: 'success',
    CANCELED: 'warning',
    ERROR: 'error',
    '': 'default',
};

export const EnrichmentStatus = ({ status }: EnrichmentStatusProps) => {
    const { translate } = useTranslate();
    return (
        <Chip
            component="span"
            label={translate(labelByStatus[status ?? ''])}
            color={colorByStatus[status ?? '']}
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
