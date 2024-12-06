import set from 'lodash/set';
import mongoDatabase from './mongoDatabase';

/**
 * Take `Object` containing a MongoDB query and throw the result
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexRunQuery
 * @param {String}  [collection="publishedDataset"]  collection to use
 * @param {Object}  [filter]       MongoDB filter
 * @param {Object}  [limit]        limit the result
 * @param {Object}  [skip]         limit the result
 * @returns {Object}
 */
export const createFunction = () =>
    async function LodexPrecomputedSelect(data, feed) {
        if (this.isLast()) {
            return feed.close();
        }
        const { ezs } = this;
        const path = this.getParam('path', 'value');
        const precomputedName = this.getParam('name');
        const filter = this.getParam('filter', data.filter || {});
        const limit = Number(this.getParam('limit', data.limit || 1000000));
        const skip = Number(this.getParam('skip', data.skip || 0));
        const connectionStringURI = this.getParam(
            'connectionStringURI',
            this.getEnv('connectionStringURI'),
        );
        const db = await mongoDatabase(connectionStringURI);

        const [precomputedObject] = await db
            .collection('precomputed')
            .find({ name: precomputedName })
            .toArray();
        const collectionName = `pc_${precomputedObject._id.toString()}`;

        const collection = db.collection(collectionName);
        let cursor = collection.find(filter);

        const total = await cursor.count();
        if (total === 0) {
            return feed.send({ total: 0 });
        }
        const func = (d, f, cxt) => {
            if (cxt.isLast()) {
                return f.close();
            }
            if (!d._id) {
                return f.end();
            }
            delete d._id;
            set(data, path, d);
            f.send(data);
        };

        const stream = cursor
            .skip(skip)
            .limit(limit)
            .stream()
            .on('error', (e) => feed.stop(e))
            .pipe(ezs(func));
        await feed.flow(stream);
    };

export default {
    precomputedSelect: createFunction(),
};
