import transformer from './operations/JOIN';
import dollar from './dollar';

/**
 * Rassemble les valeurs d'un tableau en une chaîne de caractères
 *
 *  Exemple :
 *
 * ```ini
 * [$JOIN]
 * field = output
 * path = input
 * ```
 *
 * @param {String} field     field path to apply the transformation (must be an array)
 * @param {String} separator glue between each field
 * @returns {Object}
 */
export default function $JOIN(data, feed) {
    return dollar(this, data, feed, transformer);
}
