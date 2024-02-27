import mapKeys from 'lodash/mapkeys';
import find from 'lodash/find';
import mongoDatabase from './mongoDatabase';

/**
 * Inject in each item the last characteristics (the dataset covering fields) of a LODEX.
 *
  * @example <caption>Input:</caption>
 *
 * [
 *   {
 *       "xderc": "Catégories WOS",
 *       "34Ddd": "Cette table correspond aux catégories Web Of Science.",
 *       "SD2Fs": "/api/run/syndication",
 *     }
 *   }
 * ]
 *
 * @example <caption>Output:</caption>
 *
 * [
 *   {
 *       "Titre": "Catégories WOS",
 *       "Description": "Cette table correspond aux catégories Web Of Science.",
 *       "URL": "/api/run/syndication",
 *     }
 *   }
 * ]
 *
 * @export
 * @param {string} connectionStringURI MongoDB connection string
 * @param {boolean} suffix Add ID field as a suffix
 * @name labelizeFieldID
 */
export async function LodexLabelizeFieldID(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const suffix = this.getParam('suffix', false);
    if (this.isFirst()) {
        const connectionStringURI = this.getParam('connectionStringURI');
        const db = await mongoDatabase(connectionStringURI);
        const collection = db.collection('field');
        this.fields = await collection
            .find()
            .sort({ position: 1, cover: 1 })
            .toArray();
    }
    return feed.send(mapKeys(data, (value, key) => {
        const field = find(this.fields, { name: key });
        const compl = suffix ? ` - ${key}` : '';
        return field && field.label ? `${field.label}${compl}` : key;
    }));
}

export default {
    labelizeFieldID: LodexLabelizeFieldID,
};
