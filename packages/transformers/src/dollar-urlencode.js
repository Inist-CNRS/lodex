import transformer from './operations/URLENCODE.js';
import dollar from './dollar.js';

/**
 * encode une chaine comme dans une URL
 *
 * Exemple :
 *
 * ```ini
 * [$URLENCODE]
 * field = url
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @returns {Object}
 */
export default function $URLENCODE(data, feed) {
    return dollar(this, data, feed, transformer);
}
