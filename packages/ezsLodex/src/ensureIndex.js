import mongoDatabase from './mongoDatabase.js';

/**
 * Take `Object` containing a MongoDB query and throw the result
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexRunQuery
 * @param {String}  [collection="publishedDataset"]  collection to use
 * @param {Object}  [field="uri"]  limit the result to some fields
 * @returns {Object}
 */
export default async function ensureQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const { ezs } = this;
    const field = this.getParam(
        'field',
        data.field || data.$field || 'uri',
    );
    const collectionName = String(
        this.getParam('collection', data.collection || 'publishedDataset'),
    );
    const fds = Array.isArray(field) ? field : [field];
    const fields = fds.filter(Boolean);
    const connectionStringURI = this.getParam(
        'connectionStringURI',
        data.connectionStringURI || this.getEnv('connectionStringURI'),
    );
    const db = await mongoDatabase(connectionStringURI);
    const collection = db.collection(collectionName);


    const indexes = await collection.indexes();

    await Promise.all(fields.map(fieldName => {
        const isIndexExists = indexes.some(index =>
            Object.keys(index.key).some(key =>
                key === fieldName || key.startsWith(fieldName + ".")
            )
        );
        if (!isIndexExists) {
            return collection.createIndex({ [fieldName]: 1 });
        }
        return Promise.resolve(true);
    }));
    feed.send(data);
};
