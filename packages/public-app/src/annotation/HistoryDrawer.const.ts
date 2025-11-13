export const MODE_CLOSED = 'closed' as const;
export const MODE_ALL = 'all' as const;
export const MODE_MINE = 'mine' as const;

export const MODES = [MODE_CLOSED, MODE_ALL, MODE_MINE];

export type Mode = typeof MODE_CLOSED | typeof MODE_ALL | typeof MODE_MINE;
