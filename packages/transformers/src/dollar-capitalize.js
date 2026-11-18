import transformer from './operations/CAPITALIZE.js';
import dollar from './dollar.js';

/**
 * mettre le premier caractère en majuscule
 *
 * Exemple :
 *
 * ```ini
 * [$CAPITALIZE]
 * field = title
 * ```
 *
 * @param {String} [field] field path to apply the transformation
 * @returns {Object}
 */
export default function $CAPITALIZE(data, feed) {
    return dollar(this, data, feed, transformer);
}
