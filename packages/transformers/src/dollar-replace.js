import transformer from './operations/REPLACE';
import dollar from './dollar';

/**
 * remplacer une chaîne par une autre
 *
 * Exemple :
 *
 * ```ini
 * [$REPLACE]
 * field = title
 * searchValue = 1
 * replaceValue = un
 * ```
 *
 * @param {String} field        field path to apply the transformation
 * @param {String} searchValue  value to search
 * @param {String} replaceValue value to replace with
 * @returns {Object}
 */
export default function $REPLACE(data, feed) {
    return dollar(this, data, feed, transformer);
}
