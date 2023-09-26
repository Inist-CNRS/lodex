import transformer from './operations/TRUNCATE';
import dollar from './dollar';

/**
 * tronque, prend les premières valeurs d'un tableau, d'une chaîne
 *
 * Exemple :
 *
 * ```ini
 * [$TRUNCATE]
 * field = title
 * gap = 25
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @param {String} gap   how many items or characters to keep
 * @returns {Object}
 */
export default function $TRUNCATE(data, feed) {
    return dollar(this, data, feed, transformer);
}
