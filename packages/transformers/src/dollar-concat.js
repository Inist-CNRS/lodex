import transformer from './operations/CONCAT';
import dollar from './dollar';

/**
 * concaténer deux valeurs
 *
 * Exemple :
 *
 * ```ini
 * [$CONCAT]
 * field = result
 * columns = part1
 * columns = part2
 * ```
 *
 * @param {String} field    field path to get the result of the transformation
 * @param {String} columns  field path to get value
 * @returns {Object}
 */
export default function $CONCAT(data, feed) {
    return dollar(this, data, feed, transformer, true);
}
