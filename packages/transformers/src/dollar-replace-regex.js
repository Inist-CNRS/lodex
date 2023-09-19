import transformer from './operations/REPLACE_REGEX';
import dollar from './dollar';

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
