import transformer from './operations/NUMBER';
import dollar from './dollar';

/**
 * transformer une chaîne de caractères en nombre
 *
* Exemple :
 *
 * ```ini
 * [$NUMBER]
 * field = counter
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @returns {Object}
 */
export default function $NUMBER(data, feed) {
    return dollar(this, data, feed, transformer);
}
