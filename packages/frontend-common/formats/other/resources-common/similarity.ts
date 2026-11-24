const SIMILAR_RESOURCES_ROUTINE = 'vsimilar-precomputed';

type Transformer = {
    operation: string;
    args?: { name: string; value?: unknown }[];
};

const getArgValue = (transformer: Transformer, name: string): unknown =>
    transformer.args?.find((arg) => arg.name === name)?.value;

// Matches the exact routine name: not a longer name such as vsimilar-precomputed-v2.
const SIMILAR_ROUTINE_PATTERN = new RegExp(
    `/api/run/${SIMILAR_RESOURCES_ROUTINE}(?:[/?#]|$)`,
);

const isSimilarRoutine = (value: unknown): boolean =>
    typeof value === 'string' && SIMILAR_ROUTINE_PATTERN.test(value);

export const isSimilarResourcesSource = (
    transformers?: Transformer[],
): boolean => {
    const first = transformers?.[0];
    if (!first) {
        return false;
    }

    if (first.operation === 'PRECOMPUTED') {
        return isSimilarRoutine(getArgValue(first, 'routine'));
    }

    if (first.operation === 'ROUTINE') {
        return isSimilarRoutine(getArgValue(first, 'value'));
    }

    return false;
};

const formatters = new Map<string, Intl.NumberFormat>();

export const formatSimilarity = (
    value: number,
    locale: 'fr' | 'en',
): string => {
    let formatter = formatters.get(locale);
    if (!formatter) {
        formatter = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        formatters.set(locale, formatter);
    }
    return formatter.format(value);
};

/**
 * Parses a user typed similarity degree (comma or dot as decimal separator).
 * Returns a number in [0, 1], or undefined when the input is empty or invalid.
 */
export const parseSimilarityInput = (value: string): number | undefined => {
    const normalized = value.trim().replace(',', '.');
    if (!/^\d*\.?\d+$|^\d+\.$/.test(normalized)) {
        return undefined;
    }
    const parsed = Number(normalized);
    return parsed >= 0 && parsed <= 1 ? parsed : undefined;
};
