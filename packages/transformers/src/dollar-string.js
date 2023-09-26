import transformer from './operations/STRING';
import dollar from './dollar';

/**
 * transforme la valeur en chaîne de caractères
 *
 * Exemple :
 *
 * ```ini
 * [$STRING]
 * field = title
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @returns {Object}
 */
export default function $STRING(data, feed) {
    return dollar(this, data, feed, transformer);
}
