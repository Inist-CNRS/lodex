import transformer from './operations/GET';
import dollar from './dollar';

/**
 * Récupère toutes les valeurs correspondant à un chemin (dot path)
 *
 *  Exemple :
 *
 * ```ini
 * [$GET]
 * field = output
 * path = input
 * ```
 *
 * @param {String} field    field path to get the result of the transformation
 * @param {String} path     field path to get value
 * @returns {Object}
 */
export default function $GET(data, feed) {
    return dollar(this, data, feed, transformer);
}
