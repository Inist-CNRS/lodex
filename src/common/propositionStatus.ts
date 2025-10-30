export const PROPOSED = 'PROPOSED' as const;
export const VALIDATED = 'VALIDATED' as const;
export const REJECTED = 'REJECTED' as const;

export default [PROPOSED, VALIDATED, REJECTED] as PropositionStatus[];

export type PropositionStatus =
    | typeof PROPOSED
    | typeof VALIDATED
    | typeof REJECTED;
