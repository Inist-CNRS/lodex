import transformer from './operations/SHIFT';
import dollar from './dollar';

/**
 * décaler une valeur multiple (tableau ou chaîne de caractères)
 *
 * Exemple :
 *
 * ```ini
 * [$SHIFT]
 * field = title
 * gap = 2
 * ```
 *
 * @param {String} path field path to apply the transformation
 * @param {String} gap  how many items or characters to drop
 * @returns {Object}
 */
export default function $SHIFT(data, feed) {
    return dollar(this, data, feed, transformer);
}
