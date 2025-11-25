import get from 'lodash/get.js';
import find from 'lodash/find.js';
import QuickLRU from 'quick-lru';
import mongoDatabase from './mongoDatabase.js';

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
export async function LodexInjectSyndicationFrom(
    this: any,
    data: any,
    feed: any,
) {
    if (this.isLast()) {
        return feed.close();
    }
    const connectionStringURI = this.getParam('connectionStringURI');
    const path = this.getParam('path', 'value');
    const key = Array.isArray(path) ? path.shift() : path;
    const uri = String(get(data, key, ''));

    if (!uri.startsWith('uid:') && !uri.startsWith('ark:')) {
        return feed.send(data);
    }

    if (!this.collection) {
        const db = await mongoDatabase(connectionStringURI);
        this.collection = db.collection('publishedDataset');

        const fields = await db
            .collection('field')
            .find()
            .sort({ position: 1, cover: 1 })
            .toArray();
        this.titleFieldName = get(find(fields, { overview: 1 }), 'name');
        this.summaryFieldName = get(find(fields, { overview: 2 }), 'name');
        this.detail1FieldName = get(find(fields, { overview: 3 }), 'name');
        this.detail2FieldName = get(find(fields, { overview: 4 }), 'name');
        this.subtitleFieldName = get(find(fields, { overview: 6 }), 'name');
        this.lru = new QuickLRU({ maxSize: 100 });
    }
    let title;
    let summary;
    let detail1;
    let detail2;
    let subtitle;
    if (this.lru.has(uri)) {
        [title, summary, detail1, detail2, subtitle] = this.lru.get(uri);
    } else {
        const docs = await this.collection.find({ uri }).toArray();
        const doc = get(docs.pop(), 'versions').shift();
        title = get(doc, this.titleFieldName);
        summary = get(doc, this.summaryFieldName);
        detail1 = get(doc, this.detail1FieldName);
        detail2 = get(doc, this.detail2FieldName);
        subtitle = get(doc, this.subtitleFieldName);
        this.lru.set(uri, [title, summary, detail1, detail2, subtitle]);
    }

    data[`${key}_title`] = title;
    data[`${key}_summary`] = summary;
    data[`${key}_detail1`] = detail1;
    data[`${key}_detail2`] = detail2;
    data[`${key}_subtitle`] = subtitle;

    feed.send(data);
}

export default {
    injectSyndicationFrom: LodexInjectSyndicationFrom,
};
