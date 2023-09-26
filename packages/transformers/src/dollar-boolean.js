import transformer from './operations/BOOLEAN';
import dollar from './dollar';

/**
 * transformer une chaîne de caractères en booléen
 *
  Exemple :
 *
 * ```ini
 * [$BOOLEAN]
 * field = haveMoney
 *
 * [exchange]
 * value = omit('$origin')
 * ```
 *
 * Entrée:
 *
 * ```json
 * [{
 *   "name": "Chuck",
 *   "haveMoney": 10000
 * }, {
 *   "name": "Charlot",
 *   "haveMoney": "yes"
 * }, {
 *   "name": "Alan",
 *   "haveMoney": 1
 * }]
 * ```
 *
 * Sortie:
 *
 * ```json
 * [{
 *   "name": "Chuck",
 *   "haveMoney": false
 * }, {
 *   "name": "Charlot",
 *   "haveMoney": true
 * }, {
 *   "name": "Alan",
 *   "haveMoney": true
 * }]
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @returns {Object}
 */
export default function $BOOLEAN(data, feed) {
    return dollar(this, data, feed, transformer);
}
