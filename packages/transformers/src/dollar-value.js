import transformer from './operations/VALUE';
import dollar from './dollar';

/**
 * Fixer une valeur
 *
 * Exemple :
 *
 * ```ini
 * [$VALUE]
 * field = title
 * value = Hello world
 * ```
 *
 * @param {String} field new field path
 * @param {String} value value to use to set the field
 * @returns {Object}
 */
export default function $VALUE(data, feed) {
    return dollar(this, data, feed, transformer);
}
