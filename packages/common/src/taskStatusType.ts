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
