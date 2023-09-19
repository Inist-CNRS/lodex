import transformer from './operations/REMOVE';
import dollar from './dollar';

/**
 * supprimer un élément ou une sous-chaîne
 *
 * Exemple :
 *
 * ```ini
 * [$REMOVE]
 * field = title
 * the = .
 * ```
 *
 * @param {String} path field path to apply the transformation
 * @param {String} the  value to drop in the field
 * @returns {Object}
 */
export default function $REMOVE(data, feed) {
    return dollar(this, data, feed, transformer);
}
