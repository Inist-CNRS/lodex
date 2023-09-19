import transformer from './operations/CONCAT_URI';
import dollar from './dollar';

/**
 * composer un identifiant avec plusieurs champs
 *
 * Exemple :
 *
 * ```ini
 * [$CONCAT_URI]
 * field = identifiant
 * column = nom
 * column = prenom
 * separator = -
 * ```
 *
 * @param {String} field    field path to get the result of the transformation
 * @param {String} column   field path to get data
 * @param {String} separator glue between each column
 * @returns {Object}
 */
export default function $CONCAT_URI(data, feed) {
    return dollar(this, data, feed, transformer, true);
}
