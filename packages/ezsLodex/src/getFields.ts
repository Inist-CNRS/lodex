import mongoDatabase from './mongoDatabase.js';

/**
 * Return the fields (the model) of a LODEX.
 *
 * @export
 * @param {string} connectionStringURI MongoDB connection string
 * @name LodexGetFields
 */
export async function LodexGetFields(this: any, data: any, feed: any) {
    if (this.isLast()) {
        return feed.close();
    }
    const connectionStringURI = this.getParam(
        'connectionStringURI',
        data.connectionStringURI || '',
    );
    const db = await mongoDatabase(connectionStringURI);
    const collection = db.collection('field');
    const cursor = collection.find();

    cursor
        .sort({ position: 1, cover: 1 })
        .stream()
        .on('data', (data2: any) => {
            if (typeof data2 === 'object') {
                feed.write({ fields: data2 });
            }
        })
        .on('error', (error: any) => {
            feed.write(error);
        })
        .on('end', () => {
            feed.end();
        });
}

export default {
    getFields: LodexGetFields,
};
