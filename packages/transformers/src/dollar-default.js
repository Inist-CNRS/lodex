import transformer from './operations/DEFAULT.js';
import dollar from './dollar.js';

/**
 * donner une valeur par défaut
 *
 * Exemple :
 *
 * ```ini
 * [$DEFAULT]
 * field = title
 * alternative = not available
 * ```
 *
 * @param {String} field    field path to apply the transformation
 * @param {String} alternative value to use if field does not exist
 * @returns {Object}
 */
export default function $DEFAULT(data, feed) {
    return dollar(this, data, feed, transformer);
}
