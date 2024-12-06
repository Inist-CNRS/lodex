import set from 'lodash/set';
import mongoDatabase from './mongoDatabase';

/**
 * Take `Object` Request to precomputed collection
 *
 *
 * @name LodexPRecomputedSelect
 * @param {String}  [path=value]   Default path to set result
 * @param {Object}  [filter]       MongoDB filter
 * @param {Number}  [limit]        limit the result
 * @param {Number}  [skip]         skip the result
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
        if (!precomputedObject || !precomputedObject._id) {
            return feed.stop(new Error(`${precomputedName} is unknown`));
        }
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
