import transformer from './operations/SELECT';
import dollar from './dollar';

/**
 * Prendre une valeur dans un objet à partir de son chemin (dot path)
 *
 * Exemple :
 *
 * ```ini
 * [$SELECT]
 * field = title
 * path = en
 * ```
 *
 * @param {String} field field path to get the result of the selection
 * @param {String} path  field path to get value
 * @returns {Object}
 */
export default function $SELECT(data, feed) {
    return dollar(this, data, feed, transformer);
}
