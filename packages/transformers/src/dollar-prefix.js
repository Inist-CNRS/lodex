import transformer from './operations/PREFIX';
import dollar from './dollar';

/**
 * préfixer la valeur avec une chaîne de caractères
 *
 * Exemple :
 *
 * ```ini
 * [$PREFIX]
 * field = title
 * with = #
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @param {String} with  value to add at the begining of the field
 * @returns {Object}
 */
export default function $PREFIX(data, feed) {
    return dollar(this, data, feed, transformer);
}
