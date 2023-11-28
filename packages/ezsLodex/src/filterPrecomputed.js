//import zipObject from 'lodash.zipobject';
import mongoDatabase from './mongoDatabase';
import { Readable } from 'stream';

/**
 * Take `Object` containing a MongoDB query and throw the result
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexFilterPrecomputed
 * @param {Object}  [referer]      data injected into every result object
 * @returns {Object}
 */
export const createFunction = () =>
    async function LodexFilterPrecomputed(data, feed) {
        const { connectionStringURI, precomputedName } = this.getEnv();
        const collectionName = 'precomputed';

        const db = await mongoDatabase(connectionStringURI);
        const collection = db.collection(collectionName);
        const precomputedData = (
            await collection.findOne({
                name: precomputedName,
            })
        ).data;

        const filteredItems = precomputedData.filter(
            item => item.origin[0] === (data || {}).uri,
        );

        const { ezs } = this;
        const total = await filteredItems.length;
        if (total === 0) {
            return feed.send({ total: 0 });
        }
        const path = ['total'];
        const value = [total];

        if (this.isLast()) {
            return feed.close();
        }

        const readableStream = new Readable({
            read() {
                filteredItems.map(item => this.push(item));
                this.push(null);
            },
            objectMode: true,
        });

        readableStream.pipe(ezs('assign', { path, value }));
        await feed.flow(readableStream);
    };

export default {
    filterPrecomputed: createFunction(),
};
