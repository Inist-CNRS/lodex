import transformer from './operations/TRUNCATE_WORDS';
import dollar from './dollar';

/**
 * Opération permettant la troncature par nombre de mots
 * et non pas par nombre de caractères comme pour l'opération {@link $TRUNCATE}
 *
 * Exemple :
 *
 * ```ini
 * [$TRUNCATE_WORDS]
 * field = title
 * gap = 10
 * ```
 *
 * @param {String} [field] field path to apply the transformation
 * @param {String} [gap] how many words to keep
 * @returns {Object}
 */
export default function $TRUNCATE_WORDS(data, feed) {
    return dollar(this, data, feed, transformer);
}
