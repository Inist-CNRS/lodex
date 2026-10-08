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
            w: 1,
        });
        feed.send(orderedData);
    } catch (e) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        feed.send({ error: e.message });
    }
}

export default {
    insertDocuments,
};
