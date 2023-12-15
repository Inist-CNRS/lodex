import mongoDatabase from './mongoDatabase';
/**
 * Take `Object` form a result of query on published datatset
 *
 * and get precomputed from
 *
 * @name LodexFilterPrecomputed
 * @param {Object}  [referer]      data injected into every result object
 * @returns {Object}
 */
export const createFunction = () =>
    async function LodexFilterPrecomputed(data, feed) {
        const { connectionStringURI, precomputedName } = this.getEnv();
        const fieldName = String(this.getParam('field', 'origin'));
        const collectionName = 'precomputed';
        const db = await mongoDatabase(connectionStringURI);
        const collection = db.collection(collectionName);
        const { _id: precomputedId } = await collection.findOne({
            name: precomputedName,
        });

        if (this.isLast()) {
            return feed.close();
        }
        const result = await db
            .collection(`pc_${precomputedId}`)
            .find({ [fieldName]: { $in: data } }, { projection: { _id: 0 } })
            .limit(10)
            .toArray();

        result.filter(Boolean).forEach(item => feed.write(item));
        feed.end();
    };

export default {
    filterPrecomputed: createFunction(),
};
