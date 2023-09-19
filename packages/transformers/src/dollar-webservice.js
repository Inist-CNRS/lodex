import transformer from './operations/WEBSERVICE';
import dollar from './dollar';

/**
 * Fixer une adresse de webservice
 *
 * Exemple :
 *
 * ```ini
 * [$WEBSERVICE]
 * field = title
 * webservice = https://monService
 * ```
 *
 * @param {String} field new field path
 * @param {String} webservice value to use to set the field
 * @returns {Object}
 */
export default function $WEBSERVICE(data, feed) {
    return dollar(this, data, feed, transformer);
}
