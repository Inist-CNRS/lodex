import { Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { getLocale, TaskStatus, type TaskStatusType } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

function getDisplayTimeStartedAt(startedAt: string) {
    if (!startedAt) {
        return;
    }

    const now = new Date();
    const startedAtDate = new Date(startedAt);
    const diff = now.getTime() - startedAtDate.getTime();

    const diffInMinutes = Math.floor(diff / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const relativeTime = new Intl.RelativeTimeFormat(getLocale(), {
        numeric: 'auto',
    });
    let timeSinceStarted = '';

    if (diffInHours < 1) {
        timeSinceStarted = relativeTime.format(-diffInMinutes, 'minute');
    } else if (diffInDays < 1) {
        timeSinceStarted = relativeTime.format(-diffInHours, 'hour');
    } else {
        timeSinceStarted = relativeTime.format(-diffInDays, 'day');
    }
    return timeSinceStarted;
}

type StatusChipProps = {
    label: string;
    color?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'error'
        | 'info'
        | 'success'
        | 'warning';
    startedAt?: string | null;
    sx?: object;
};

export const StatusChip = ({
    label,
    color,
    startedAt,
    sx,
}: StatusChipProps) => {
    const [spentTime, setSpentTime] = useState(
        startedAt ? getDisplayTimeStartedAt(startedAt) : '',
    );
    useEffect(() => {
        if (!startedAt) return;
        setSpentTime(getDisplayTimeStartedAt(startedAt));
        const interval = setInterval(() => {
            setSpentTime(getDisplayTimeStartedAt(startedAt));
        }, 59000);
        return () => clearInterval(interval);
    }, [startedAt]);
    const finalLabel = `${label}${startedAt ? ` (${spentTime})` : ''}`;
    return <Chip component="span" label={finalLabel} color={color} sx={sx} />;
};

type PrecomputedStatusProps = {
    status: TaskStatusType | undefined;
    startedAt?: string | null;
};

export const PrecomputedStatus = ({
    status,
    startedAt = null,
}: PrecomputedStatusProps) => {
    const { translate } = useTranslate();

    if (status === TaskStatus.PENDING) {
        return (
            <StatusChip
                label={translate('precomputed_status_pending')}
                color="warning"
                startedAt={startedAt}
            />
        );
    }
    if (status === TaskStatus.IN_PROGRESS) {
        return (
            <StatusChip
                label={translate('precomputed_status_running')}
                color="info"
                startedAt={startedAt}
            />
        );
    }

    if (status === TaskStatus.PAUSED) {
        return (
            <StatusChip
                label={translate('precomputed_status_paused')}
                color="info"
            />
        );
    }

    if (status === TaskStatus.FINISHED) {
        return (
            <StatusChip
                label={translate('precomputed_status_done')}
                color="success"
            />
        );
    }

    if (status === TaskStatus.ERROR) {
        return (
            <StatusChip
                label={translate('precomputed_status_error')}
                color="error"
            />
        );
    }

    if (status === TaskStatus.CANCELED) {
        return (
            <StatusChip
                label={translate('precomputed_status_canceled')}
                color="warning"
            />
        );
    }

    if (status === TaskStatus.ON_HOLD) {
        return (
            <StatusChip
                label={translate('precomputed_status_hold')}
                sx={{ backgroundColor: '#539CE1', color: '#fff' }}
                startedAt={startedAt}
            />
        );
    }

    return (
        <StatusChip
            label={translate('precomputed_status_not_started')}
            sx={{ backgroundColor: 'neutral' }}
        />
    );
};
