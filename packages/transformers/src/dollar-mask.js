import transformer from './operations/MASK';
import dollar from './dollar';

/**
 * S'assure que la valeur respecte une expression régulière
 *
 * Exemple :
 *
 * ```ini
 * [$MASK]
 * field = title
 * with = ^[a-z]+$
 * ```
 *
 * @param {String} path field path to apply the control
 * @param {String} with regular expression to check
 * @returns {Object}
 */
export default function $MASK(data, feed) {
    return dollar(this, data, feed, transformer);
}
