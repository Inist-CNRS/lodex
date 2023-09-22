import transformer from './operations/UNIQ';
import dollar from './dollar';

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
