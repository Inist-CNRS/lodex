export const DEFAULT_PAGE_SIZE = 6;

// Upper bound of "Maximum number of resources": every resource is loaded in a
// single call, and the routine clamps to the same value.
export const MAX_SIMILAR_RESOURCES = 100;

// A page size that is not a positive integer (e.g. an emptied input) falls back to the default.
export const toPageSize = (value: unknown): number =>
    typeof value === 'number' && Number.isInteger(value) && value > 0
        ? value
        : DEFAULT_PAGE_SIZE;
