/** Converts a MongoDB vectorSearchScore (cosine) to a similarity in [0, 1]. */
export const scoreToSimilarity = (score: number): number =>
    Math.max(0, 2 * score - 1);

/** Converts a similarity in [0, 1] to a MongoDB vectorSearchScore. */
export const similarityToScore = (similarity: number): number =>
    (1 + similarity) / 2;

export const parseMinSimilarity = (value: unknown): number | undefined => {
    if (typeof value !== 'number' && typeof value !== 'string') {
        return undefined;
    }
    const normalized =
        typeof value === 'string' ? value.trim().replace(',', '.') : value;
    if (normalized === '') {
        return undefined;
    }
    const number = Number(normalized);
    if (!Number.isFinite(number) || number < 0 || number > 1) {
        return undefined;
    }
    return number;
};

export const DEFAULT_MAX_RESOURCES = 10;

export const parseMaxResources = (value: unknown): number => {
    if (typeof value !== 'number' && typeof value !== 'string') {
        return DEFAULT_MAX_RESOURCES;
    }
    if (typeof value === 'string' && value.trim() === '') {
        return DEFAULT_MAX_RESOURCES;
    }
    const number = Number(value);
    return Number.isInteger(number) && number >= 1
        ? number
        : DEFAULT_MAX_RESOURCES;
};
