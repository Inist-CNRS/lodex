/**
 * Truncate a string without cutting word
 * @param stringIn string to truncate
 * @param sizeIn approximated size of the output string
 * @returns {string} Truncated string
 */
export const truncateByWords = (stringIn, sizeIn) => {
    // Trivial case
    if (sizeIn <= 0 || sizeIn >= stringIn.length) return stringIn;

    // setup necessary variable
    let currentSize = 0;
    let finalOutput = [];
    const subStringList = stringIn.split(/\s+/);

    // Loop into all word
    for (let i = 0; i < subStringList.length; i++) {
        // Get current word
        const substr = subStringList[i];
        // Sort the actual size of the output
        currentSize += substr.length;
        // Check if the size of the output is greater or equals of the wanted size
        if (currentSize >= sizeIn) {
            // Check if we are at the last word
            if (i === subStringList.length - 1) {
                // Add the last word
                finalOutput[i] = substr;
                break;
            }
            // Add the last word with the ellipsis
            finalOutput[i] = [substr, '…'].join('');
            break;
        }
        finalOutput[i] = substr;
    }

    // Join all word with space
    return finalOutput.join(' ');
};
