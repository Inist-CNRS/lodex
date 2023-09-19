import transformer from './operations/COLUMN';
import dollar from './dollar';

/**
 * prendre une donnée dans un champ (colonne d'un fichier tabulé)
 *
 * Exemple :
 *
 * ```ini
 * [$COLUMN]
 * field = newTitle
 * column = oldTitle
 * ```
 *
 * @param {String} field    field path to apply the transformation
 * @param {String} column   value to use during the transformation
 * @returns {Object}
 */
export default function $COLUMN(data, feed) {
    return dollar(this, data, feed, transformer, true);
}
