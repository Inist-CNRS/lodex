import get from 'lodash/get.js';
import setObject from 'lodash/set.js';
import mapKeys from 'lodash/mapKeys.js';
import find from 'lodash/find.js';
import take from 'lodash/take.js';
import zipObject from 'lodash/zipObject.js';
import mongoDatabase from './mongoDatabase.js';

/**
 * Take an object and map its keys to the one in mapping parameters.
 * Keep keys absent in `from` parameter.
 *
 * <caption>Input:</caption>
 *
 * ```json
 * [{
 *   "dFgH": "Value",
 *   "AaAa": "Value 2"
 * }]
 * ```
 *
 * <caption>EZS:</caption>
 *
 * ```ini
 * [semanticMapping]
 * from = http://purl.org/dc/elements/1.1/title
 * to = Title
 * from = http://purl.org/dc/elements/1.1/source
 * to = source
 * ```
 *
 * <caption>Output</caption>
 *
 * ```json
 * [{
 *   "Title": "Value",
 *   "source": "Value 2"
 * }]
 * ```
 *
 * @export
 * @param {string} connectionStringURI MongoDB connection string
 * @param {string} fields use local model
 * @param {string} from scheme
 * @param {string} to new name
 * @name semanticMapping
 */
export async function semanticMapping(this: any, data: any, feed: any) {
    if (this.isLast()) {
        return feed.close();
    }

    const path = this.getParam('path');
    const localFields = this.getParam('fields', []);
    const from = this.getParam('from', []);
    const to = this.getParam('to', []);
    const froms = Array.isArray(from) ? from : [from];
    const tos = Array.isArray(to) ? to : [to];
    const mapping = zipObject(froms, take(tos, from.length));

    if (this.isFirst()) {
        if (localFields.length === 0) {
            const connectionStringURI = this.getParam('connectionStringURI');
            const db = await mongoDatabase(connectionStringURI);
            const collection = db.collection('field');
            this.fields = await collection
                .find()
                .sort({ position: 1, cover: 1 })
                .toArray();
        } else {
            this.fields = localFields;
        }
    }

    const obj = path ? get(data, path) : data;
    // @ts-expect-error TS(6133): 'value' is declared but its value is never read.
    const res = mapKeys(obj, (value: any, key: any) => {
        const field = find(this.fields, { name: key });
        // SI le champ n'est pas dans le modèle on n'y touche pas
        if (!field) return key;
        //	SI le champ est dans le modèle, mais n'est pas souhaité, on le supprime
        if (!mapping[field.scheme]) return '__';
        return mapping[field.scheme];
    });
    delete res['__'];
    if (path) {
        setObject(data, path, res);
        return feed.send(data);
    }
    return feed.send(res);
}

export default {
    semanticMapping: semanticMapping,
};
