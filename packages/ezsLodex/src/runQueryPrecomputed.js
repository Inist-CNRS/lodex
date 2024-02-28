import zipObject from 'lodash/zipObject';
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
            filter: filterDocuments,
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
        const filter = {};

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

        const postFilter =
            Object.keys(filterDocuments).length === 0
                ? {}
                : {
                      documents: { $elemMatch: filterDocuments }, //{ "versions.0.abxD": "2033" }
                  };
        const aggregatePipeline = [
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'publishedDataset',
                    localField: 'origin',
                    foreignField: 'uri',
                    as: 'documents',
                },
            },
            {
                $match: postFilter,
            },
        ];
        let cursor = collection.aggregate(
            aggregatePipeline,
            fields.length > 0
                ? { ...projection, allowDiskUse: true }
                : {
                      allowDiskUse: true,
                  },
        );

        const count = await collection
            .aggregate(aggregatePipeline.concat({ $count: 'value' }))
            .toArray();
        if (count.length === 0) {
            return feed.send({ total: 0 });
        }
        const path = ['total'];
        const value = [count[0] ? count[0].value : 0];
        if (referer) {
            path.push('referer');
            value.push(referer);
        }

        const stream = cursor
            .sort(sort)
            .skip(Number(skip || 0))
            .limit(Number(maxSize || 1000000))
            .stream()
            .on('error', e => feed.stop(e))
            .pipe(ezs('assign', { path, value }));
        await feed.flow(stream);
    };

export default {
    runQueryPrecomputed: createFunction(),
};
