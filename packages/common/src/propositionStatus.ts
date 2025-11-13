export const PropositionStatus = {
    PROPOSED: 'PROPOSED' as const,
    VALIDATED: 'VALIDATED' as const,
    REJECTED: 'REJECTED' as const,
};

export const propositionStatuses = [
    PropositionStatus.PROPOSED,
    PropositionStatus.VALIDATED,
    PropositionStatus.REJECTED,
];

export default propositionStatuses;

export type PropositionStatusType =
    | typeof PropositionStatus.PROPOSED
    | typeof PropositionStatus.VALIDATED
    | typeof PropositionStatus.REJECTED;
