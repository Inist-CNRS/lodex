import transformer from './operations/SUFFIX';
import dollar from './dollar';

/**
 * ajoute une chaîne de caractères à la fin d'une chaîne ou d'un tableau
 *
 * Exemple :
 *
 * ```ini
 * [$SUFFIX]
 * field = title
 * with = !
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @param {String} with  value to add at the end of the field
 * @returns {Object}
 */
export default function $SUFFIX(data, feed) {
    return dollar(this, data, feed, transformer);
}
