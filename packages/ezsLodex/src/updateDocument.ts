import mongoDatabase from './mongoDatabase';

export const createFunction = () =>
    async function updateDocument(this: any, data: any, feed: any) {
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
            // @ts-expect-error TS(18004): No value exists in scope for the shorthand propert... Remove this comment to see the full error message
            feed.send({ id, value, error: e.message });
        }
    };

export default {
    updateDocument: createFunction(),
};
