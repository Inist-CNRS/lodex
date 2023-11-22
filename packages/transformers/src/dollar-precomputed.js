import transformer from './operations/PRECOMPUTED';
import dollar from './dollar';

/**
 * Fixer une adresse de precomputed
 *
 * Exemple :
 *
 * ```ini
 * [$PRECOMPUTED]
 * field = title
 * precomputed = myJob
 * routine = /api/run/count-all/
 * ```
 *
 * @param {String} field new field path
 * @param {String} precomputed value to use to set the precomputed data
 * @param {String} routine value to use to set the routine
 * @returns {Object}
 */
export default function $PRECOMPUTED(data, feed) {
    return dollar(this, data, feed, transformer);
}
