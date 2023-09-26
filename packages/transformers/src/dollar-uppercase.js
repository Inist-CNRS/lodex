import transformer from './operations/UPPERCASE';
import dollar from './dollar';

/**
 * mettre la chaîne en majuscules
 *
 * Exemple :
 *
 * ```ini
 * [$UPPERCASE]
 * field = title
 * ```
 *
 * @param {String} field field path to apply the transformation
 * @returns {Object}
 */
export default function $UPPERCASE(data, feed) {
    return dollar(this, data, feed, transformer);
}
