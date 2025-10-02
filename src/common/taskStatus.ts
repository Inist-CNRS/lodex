export const PENDING = 'PENDING';
export const IN_PROGRESS = 'IN_PROGRESS';
export const ON_HOLD = 'ON_HOLD';
export const PAUSED = 'PAUSED';
export const FINISHED = 'FINISHED';
export const ERROR = 'ERROR';
export const CANCELED = 'CANCELED';

export type TaskStatus =
    | typeof PENDING
    | typeof IN_PROGRESS
    | typeof ON_HOLD
    | typeof PAUSED
    | typeof FINISHED
    | typeof ERROR
    | typeof CANCELED;
