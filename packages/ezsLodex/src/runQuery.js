import zipObject from 'lodash.zipobject';
import mongoDatabase from './mongoDatabase';

/**
 * Take `Object` containing a MongoDB query and throw the result
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexRunQuery
 * @param {String}  [collection="publishedDataset"]  collection to use
 * @param {Object}  [referer]      data injected into every result object
 * @param {Object}  [filter]       MongoDB filter
 * @param {String}  [sortOn]       Field to sort on
 * @param {String}  [sortOrder]    Oder to sort
 * @param {Object}  [field="uri"]  limit the result to some fields
 * @param {Object}  [limit]        limit the result
 * @param {Object}  [skip]         limit the result
 * @returns {Object}
 */
export const createFunction = () => async function LodexRunQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const { ezs } = this;
    const referer = this.getParam('referer', data.referer);
    const filter = this.getParam('filter', data.filter || {});
    filter.removedAt = { $exists: false }; // Ignore removed resources
    const sortOn = this.getParam('sortOn', data.sortOn);
    const sortOrder = this.getParam('sortOrder', data.sortOrder);
    const field = this.getParam(
        'field',
        data.field || data.$field || 'uri',
    );
    const collectionName = String(this.getParam('collection', data.collection || 'publishedDataset'));
    const fds = Array.isArray(field) ? field : [field];
    const fields = fds.filter(Boolean);
    const limit = Number(this.getParam('limit', data.limit || 1000000));
    const skip = Number(this.getParam('skip', data.skip || 0));
    const projection = zipObject(fields, Array(fields.length).fill(true));
    const connectionStringURI = this.getParam(
        'connectionStringURI',
        data.connectionStringURI || '',
    );
    const db = await mongoDatabase(connectionStringURI);
    const collection = db.collection(collectionName);
    let cursor = collection.find(filter, fields.length > 0 ? projection : null);

    if (sortOn) {
        cursor = cursor.sort(`versions.${sortOn}`, sortOrder === 'desc' ? -1 : 1).allowDiskUse();
    }

    const total = await cursor.count();
    if (total === 0) {
        return feed.send({ total: 0 });
    }
    const path = ['total'];
    const value = [total];
    if (referer) {
        path.push('referer');
        value.push(referer);
    }

    const stream = cursor
        .skip(skip)
        .limit(limit)
        .stream()
        .on('error', (e) => feed.stop(e))
        .pipe(ezs('assign', { path, value }));
    await feed.flow(stream);
};

export default {
    runQuery: createFunction(),
};
