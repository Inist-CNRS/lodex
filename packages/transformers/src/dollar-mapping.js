import transformer from './operations/MAPPING';
import dollar from './dollar';

/**
 * Opération permettant le remplacement à partir d'une table
 * (équivalent à l'enchaînement de plusieurs opérations {@link $REPLACE})
 *
 * Exemple :
 *
 * ```ini
 * [$MAPPING]
 * field = keywords
 * list = "hello":"bonjour", "hi":"salut"
 * ```
 *
 * @param {String} field    field path to apply the transformation
 * @param {String} list     the mapping list
 * @returns {Object}
 */
export default function $MAPPING(data, feed) {
    return dollar(this, data, feed, transformer);
}
