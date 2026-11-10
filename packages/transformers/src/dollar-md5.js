import transformer from './operations/MD5.js';
import dollar from './dollar.js';

/**
 * empreinte MD5 d'un champ
 *
 * Exemple :
 *
 * ```ini
 * [$MD5]
 * field = title
 * ```
 *
 * @param {String} [field] field path to apply the transformation
 * @returns {Object}
 */
export default function $MD5(data, feed) {
    return dollar(this, data, feed, transformer);
}
