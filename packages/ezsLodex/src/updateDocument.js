import mongoDatabase from './mongoDatabase.js';

export const createFunction = () =>
    async function updateDocument(data, feed) {
        if (this.isLast()) {
            return feed.close();
        }
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

        try {
            const { id, value } = data;
            await collection.updateOne(
                {
                    uri: id,
                },
                { $set: { [fieldname]: value } },
            );
            feed.send(data);
        } catch (e) {
            feed.send({ id, value, error: e.message });
        }
    };

export default {
    updateDocument: createFunction(),
};
