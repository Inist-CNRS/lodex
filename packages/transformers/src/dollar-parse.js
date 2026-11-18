import transformer from './operations/PARSE.js';
import dollar from './dollar.js';

/**
 * Analyser un chaine de caractère comme étant du JSON
 *
 * Exemple :
 *
 * ```ini
 * [$PARSE]
 * field = json
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @returns {Object}
 */
export default function $PARSE(data, feed) {
    return dollar(this, data, feed, transformer);
}
