import { Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import getLocale from '../../../../common/getLocale';
import {
    FINISHED,
    IN_PROGRESS,
    PENDING,
    ERROR,
    CANCELED,
    PAUSED,
    ON_HOLD,
    type TaskStatus,
} from '../../../../common/taskStatus';

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
        const interval = setInterval(() => {
            setSpentTime(getDisplayTimeStartedAt(startedAt));
        }, 59000);
        return () => clearInterval(interval);
    }, [startedAt]);
    const finalLabel = `${label}${startedAt ? ` (${spentTime})` : ''}`;
    return <Chip component="span" label={finalLabel} color={color} sx={sx} />;
};

type PrecomputedStatusProps = {
    status: TaskStatus | undefined;
    translate: (key: string) => string;
    startedAt?: string | null;
};

export const PrecomputedStatus = ({
    status,
    translate,
    startedAt = null,
}: PrecomputedStatusProps) => {
    if (status === PENDING) {
        return (
            <StatusChip
                label={translate('precomputed_status_pending')}
                color="warning"
                startedAt={startedAt}
            />
        );
    }
    if (status === IN_PROGRESS) {
        return (
            <StatusChip
                label={translate('precomputed_status_running')}
                color="info"
                startedAt={startedAt}
            />
        );
    }

    if (status === PAUSED) {
        return (
            <StatusChip
                label={translate('precomputed_status_paused')}
                color="info"
            />
        );
    }

    if (status === FINISHED) {
        return (
            <StatusChip
                label={translate('precomputed_status_done')}
                color="success"
            />
        );
    }

    if (status === ERROR) {
        return (
            <StatusChip
                label={translate('precomputed_status_error')}
                color="error"
            />
        );
    }

    if (status === CANCELED) {
        return (
            <StatusChip
                label={translate('precomputed_status_canceled')}
                color="warning"
            />
        );
    }

    if (status === ON_HOLD) {
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
