import get from 'lodash.get';
import find from 'lodash.find';
import QuickLRU from 'quick-lru';
import mongoDatabase from './mongoDatabase';

/**
 * Inject title & description (syndicationà from field what conatsin the uri of one resource
 *
 * @example <caption>Output:</caption>
 *
 * [
 *   {
 {
 *       "id": "uri:/ZD44DSQ",
 *       "id-title": "Titre de la ressource uri:/ZD44DSQ",
 *       "id-description": "Description de la ressource uri:/ZD44DSQ",
 *       "value": 10
 *     }
 *   }
 * ]
 *
 * @export
 * @param {string} path Field path contains URI
 * @param {string} connectionStringURI MongoDB connection string
 * @name LodexInjectSyndicationFrom
 */
export async function LodexInjectSyndicationFrom(data, feed) {
    const connectionStringURI = this.getParam('connectionStringURI');
    if (this.isFirst()) {
        const db = await mongoDatabase(connectionStringURI);
        this.collection = db.collection('publishedDataset');

        const fields = await db.collection('field')
            .find()
            .sort({ position: 1, cover: 1 })
            .toArray();
        this.titleFieldName = get(find(fields, { overview: 1 }), 'name');
        this.summaryFieldName = get(find(fields, { overview: 2 }), 'name');
        this.lru = new QuickLRU({ maxSize: 100 });
    }
    if (this.isLast()) {
        return feed.close();
    }

    const path = this.getParam('path', 'value');
    const key = Array.isArray(path) ? path.shift() : path;
    const uri = get(data, key);
    let title;
    let summary;
    if (this.lru.has(uri)) {
        [title, summary] = this.lru.get(uri);
    } else {
        const docs = await this.collection.find({ uri }).toArray();
        const doc = get(docs.pop(), 'versions').shift();
        title = get(doc, this.titleFieldName);
        summary = get(doc, this.summaryFieldName);
        this.lru.set(uri, [title, summary]);
    }

    data[`${key}_title`] = title;
    data[`${key}_summary`] = summary;
    feed.send(data);
}

export default {
    injectSyndicationFrom: LodexInjectSyndicationFrom,
};
