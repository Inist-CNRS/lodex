export type EnrichmentStatus = {
    status:
        | 'IN_PROGRESS'
        | 'PENDING'
        | 'FINISHED'
        | 'CANCELED'
        | 'ERROR'
        | 'PAUSED'
        | '';
};
