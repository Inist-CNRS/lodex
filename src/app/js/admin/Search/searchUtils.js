/**
 * Normalizes a string by converting to lowercase, removing diacritics, and handling edge cases
 * @param {string} str - The string to normalize
 * @returns {string} The normalized string
 */
export const normalize = (str) =>
    (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

/**
 * Tokenizes a string by splitting on spaces and special characters
 * @param {string} str - The string to tokenize
 * @returns {string[]} Array of tokens
 */
export const tokenize = (str) =>
    normalize(str)
        .split(/[^a-z0-9]+/)
        .filter(Boolean);

/**
 * Filters options based on input value using token matching and exact matching
 * @param {Array} options - Array of options to filter
 * @param {Object} params - Parameters object
 * @param {string} params.inputValue - The input value to filter by
 * @returns {Array} Filtered array of options
 */
export const filterOptions = (options, { inputValue }) => {
    const inputTokens = tokenize(inputValue);
    return options.filter((option) => {
        const labelTokens = tokenize(option.label);
        const nameTokens = tokenize(option.name);
        const allTokens = labelTokens.concat(nameTokens);

        if (inputTokens.length === 0) return true;

        // All input tokens must match the beginning of a word in label or name
        const allMatch = inputTokens.every((inputToken) =>
            allTokens.some((token) => token.startsWith(inputToken)),
        );

        // Or if input exactly matches the label or name
        const normalizedInput = normalize(inputValue);
        const matchExact =
            normalize(option.label) === normalizedInput ||
            normalize(option.name) === normalizedInput;

        return allMatch || matchExact;
    });
};
