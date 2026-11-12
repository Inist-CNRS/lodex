import transformer from './operations/REPLACE_REGEX.js';
import dollar from './dollar.js';

/**
 * remplacer une chaîne par une autre via une exrpression régulière
 *
 * Exemple :
 *
 * ```ini
 * [$REPLACE_REGEX]
 * field = title
 * searchValue = $hel\w+
 * replaceValue = bonjour
 * ```
 *
 * @param {String} field        field path to apply the transformation
 * @param {String} searchValue  regex to search
 * @param {String} replaceValue value to replace with
 * @returns {Object}
 */
export default function $REPLACE_REGEX(data, feed) {
    return dollar(this, data, feed, transformer);
}
