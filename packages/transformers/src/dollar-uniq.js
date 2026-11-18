import transformer from './operations/UNIQ.js';
import dollar from './dollar.js';

/**
 * dédoublonne les valeurs (dans un tableau)
 *
 * Exemple :
 *
 * ```ini
 * [$UNIQ]
 * field = title
 * ```
 *
 * @param {String} field field path to apply the transformation (must be an aarray)
 * @returns {Object}
 */
export default function $UNIQ(data, feed) {
    return dollar(this, data, feed, transformer);
}
