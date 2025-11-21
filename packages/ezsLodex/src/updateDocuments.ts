import { ObjectId } from 'mongodb';
import mongoDatabase from './mongoDatabase.js';

export const createFunction = () =>
    async function updateDocument(this: any, data: any, feed: any) {
        if (this.isLast()) {
            return feed.close();
        }

        const idField = this.getParam('idField', 'uri');
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
            this.getEnv('connectionStringURI'),
        );
        const db = await mongoDatabase(connectionStringURI);
        const collection = db.collection(collectionName);

        const fieldname = fields.shift();
        const items = [].concat(data);
        const query = items.map(({ id, value }: any) => ({
            updateOne: {
                filter: {
                    [idField]: idField === '_id' ? new ObjectId(id) : id,
                },
                update: { $set: { [fieldname]: value } },
            },
        }));
        try {
            await collection.bulkWrite(query);
            feed.send(data);
        } catch (e) {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            feed.send({ error: e.message });
        }
    };

export default {
    updateDocuments: createFunction(),
};
