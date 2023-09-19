import transformer from './operations/TRIM';
import dollar from './dollar';

/**
 *  enlève les espaces au début et à la fin d'une chaîne de caractères
 *
 * Exemple :
 *
 * ```ini
 * [$TRIM]
 * field = title
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @returns {Object}
 */
export default function $TRIM(data, feed) {
    return dollar(this, data, feed, transformer);
}
