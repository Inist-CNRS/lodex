import mongoDatabase from './mongoDatabase';

/**
 * Take `Object` containing a MongoDB query and throw the result
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexSaveDocuments
 * @param {String}  [collection="publishedDataset"]  collection to use
 * @param {String}  [connectionStringURI] to connetc to mongo
 * @returns {Object}
 */
export const createFunction = () =>
    async function LodexSaveDocuments(data, feed) {
        const connectionStringURI = String(
            this.getParam('connectionStringURI'),
        );
        const collectionName = String(
            this.getParam('collection', 'publishedDataset'),
        );
        const db = await mongoDatabase(connectionStringURI);
        const collection = db.collection(collectionName);
        if (this.isLast()) {
            return feed.close();
        }
        if (!Array.isArray(data)) {
            return feed.stop(new Error('Use [group] before saveDocuments.'));
        }
        try {
            if (this.isFirst()) {
                await collection.deleteMany({});
            }
            const { insertedCount } = await collection.insertMany(data, {
                forceServerObjectId: true,
                w: 1,
            });
            return feed.send(insertedCount);
        } catch (error) {
            return feed.stop(error);
        }
    };

export default {
    saveDocuments: createFunction(),
};
