import transformer from './operations/LOWERCASE.js';
import dollar from './dollar.js';

/**
 * mettre en bas de casse (minuscules)
 *
 * Exemple :
 *
 * ```ini
 * [$LOWERCASE]
 * field = title
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @returns {Object}
 */
export default function $LOWERCASE(data, feed) {
    return dollar(this, data, feed, transformer);
}
