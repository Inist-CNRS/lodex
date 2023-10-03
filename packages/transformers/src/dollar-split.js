import transformer from './operations/SPLIT';
import dollar from './dollar';

/**
 * segmente une chaîne de caractères en tableau
 *
 * Exemple :
 *
 * ```ini
 * [$SPLIT]
 * field = title
 * separator = |
 * ```
 *
 * @param {String} field     field path to apply the transformation
 * @param {String} separator value to use to split the field
 * @returns {Object}
 */
export default function $SPLIT(data, feed) {
    return dollar(this, data, feed, transformer);
}
