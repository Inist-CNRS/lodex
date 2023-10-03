import transformer from './operations/FORMAT';
import dollar from './dollar';

/**
 * appliquer un patron (template)
 *
 * ```ini
 * [$DEFAULT]
 * field = source
 * with = (%s:%s)
 * ```
 *
 * @param {String} field    field path to get data source (must be an array)
 * @param {String} with     template string like sprintf
 * @returns {Object}
 */
export default function $FORMAT(data, feed) {
    return dollar(this, data, feed, transformer);
}
