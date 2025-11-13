export const PENDING = 'PENDING';
export const IN_PROGRESS = 'IN_PROGRESS';
export const ON_HOLD = 'ON_HOLD';
export const PAUSED = 'PAUSED';
export const FINISHED = 'FINISHED';
export const ERROR = 'ERROR';
export const CANCELED = 'CANCELED';

export const TaskStatus = {
    PENDING: 'PENDING' as const,
    IN_PROGRESS: 'IN_PROGRESS' as const,
    ON_HOLD: 'ON_HOLD' as const,
    PAUSED: 'PAUSED' as const,
    FINISHED: 'FINISHED' as const,
    ERROR: 'ERROR' as const,
    CANCELED: 'CANCELED' as const,
};

export type TaskStatusType =
    | typeof TaskStatus.PENDING
    | typeof TaskStatus.IN_PROGRESS
    | typeof TaskStatus.ON_HOLD
    | typeof TaskStatus.PAUSED
    | typeof TaskStatus.FINISHED
    | typeof TaskStatus.ERROR
    | typeof TaskStatus.CANCELED;

export const labelByStatus: Record<TaskStatusType | '', string> = {
    IN_PROGRESS: 'enrichment_status_running',
    PENDING: 'enrichment_status_pending',
    FINISHED: 'enrichment_status_done',
    CANCELED: 'enrichment_status_canceled',
    ERROR: 'enrichment_status_error',
    PAUSED: 'enrichment_status_paused',
    ON_HOLD: 'enrichment_status_paused',
    '': 'enrichment_status_not_started',
};
