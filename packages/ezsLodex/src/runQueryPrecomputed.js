import zipObject from 'lodash.zipobject';
import mongoDatabase from './mongoDatabase';

/**
 * Take `Object` containing a MongoDB query and throw the result
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexRunQueryPrecomputed
 * @param {Object}  [valueFieldName=value] field to use as value
 * @param {Object}  [labelFieldName=id] field to use as label
 * @returns {Object}
 */
export const createFunction = () =>
    async function LodexRunQueryPrecomputed(data, feed) {
        if (this.isLast()) {
            return feed.close();
        }
        const { ezs } = this;
        const {
            filter,
            referer,
            field,
            precomputedId,
            connectionStringURI,
            skip,
            minValue,
            maxValue,
            maxSize,
            orderBy,
        } = data;

        const collectionName = `pc_${precomputedId}`;
        const fds = Array.isArray(field) ? field : [field];
        const fields = fds.filter(Boolean);
        const projection = zipObject(fields, Array(fields.length).fill(true));

        const valueFieldName = this.getParam('valueFieldName', 'value');
        const labelFieldName = this.getParam('labelFieldName', 'id');

        if (minValue) {
            const minFilter = {
                $gte: Number(minValue),
            };
            filter[valueFieldName] = {
                ...minFilter,
            };
        }
        if (maxValue) {
            const maxFilter = {
                $lte: Number(maxValue),
            };
            filter[valueFieldName] = {
                ...maxFilter,
            };
        }
        const [order, dir] = String(orderBy).split('/');
        const ord = order === 'value' ? valueFieldName : labelFieldName;
        const sort = order && dir ? { [ord]: dir === 'asc' ? 1 : -1 } : {};

        const db = await mongoDatabase(connectionStringURI);
        const collection = db.collection(collectionName);

        let cursor = collection.find(
            filter,
            fields.length > 0 ? projection : null,
        );

        const total = await cursor.count();
        if (total === 0) {
            return feed.send({ total: 0 });
        }
        const path = ['total'];
        const value = [total];
        if (referer) {
            path.push('referer');
            value.push(referer);
        }

        const stream = cursor
            .sort(sort)
            .allowDiskUse()
            .skip(Number(skip || 0))
            .limit(Number(maxSize || 1000000))
            .stream()
            .on('error', e => feed.stop(e))
            .pipe(ezs('debug'))
            .pipe(ezs('assign', { path, value }));
        await feed.flow(stream);
    };

export default {
    runQueryPrecomputed: createFunction(),
};
