import mongoDatabase from './mongoDatabase.js';

const moveUriToFirstPosition = (data: any) => {
    return data.map((item: any) => {
        const { uri, ...rest } = item;
        if (!uri) return item;
        return { uri, ...rest };
    });
};

async function insertDocuments(this: any, data: any, feed: any) {
    if (this.isLast()) {
        return feed.close();
    }
    const collectionName = String(
        this.getParam('collection', data.collection || 'publishedDataset'),
    );
    const connectionStringURI = this.getParam(
        'connectionStringURI',
        this.getEnv('connectionStringURI'),
    );
    const db = await mongoDatabase(connectionStringURI);
    const collection = db.collection(collectionName);

    try {
        const orderedData = moveUriToFirstPosition([].concat(data));
        await collection.insertMany(orderedData, {
            forceServerObjectId: true,
            // a duplicate must not stop the rest of the batch from being inserted
            ordered: false,
            w: 1,
        });
        feed.send(orderedData);
    } catch (e) {
        // one item per document, so that the publication progress still
        // counts every document of a failed batch
        feed.send(
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            [].concat(data).map(() => ({ error: e.message })),
        );
    }
}

export default {
    insertDocuments,
};
