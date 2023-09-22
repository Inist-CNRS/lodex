import transformer from './operations/LOWERCASE';
import dollar from './dollar';

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
