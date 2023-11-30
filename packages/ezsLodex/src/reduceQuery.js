import hasher from 'node-object-hash';
import mongoDatabase from './mongoDatabase';
import reducers from './reducers';

const hashCoerce = hasher({ sort: false, coerce: true });

/**
 * Take an `Object` containing a MongoDB query, and a reducer, then throw the
 * result.
 *
 * The input object must contain a `connectionStringURI` property, containing
 * the connection string to MongoDB.
 *
 * @name LodexReduceQuery
 * @param {String}   reducer         The name of the reducer to use
 * @param {Object}   [referer]       data injected into every result object
 * @param {Object}   [filter={}]     MongoDB filter
 * @param {string[]} [field="uri"]   limit the result to some fields
 * @param {Object}   [minValue]      limit the result
 * @param {Object}   [maxValue]      limit the result
 * @param {Object}   [maxSize=1000000]  limit the result
 * @param {Object}   [orderBy]       sort the result
 * @returns {Object}
 */
export const createFunction = () => async function LodexReduceQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const { ezs } = this;
    const referer = this.getParam('referer', data.referer);
    const filter = this.getParam('filter', data.filter || {});
    filter.removedAt = { $exists: false }; // Ignore removed resources
    const field = this.getParam(
        'field',
        data.field || data.$field || 'uri',
    );
    const minValue = this.getParam('minValue', data.minValue);
    const maxValue = this.getParam('maxValue', data.maxValue);
    const orderBy = this.getParam('orderBy', data.orderBy);
    const limit = Number(this.getParam('maxSize', data.maxSize || 1000000));
    const skip = Number(this.getParam('skip', data.skip || 0));

    const reducer = this.getParam('reducer');
    if (!reducer) {
        throw new Error('reducer= must be defined as parameter.');
    }
    if (!reducers[reducer]) {
        throw new Error(`Unknown reducer '${reducer}'`);
    }

    const { map, reduce, finalize, fieldname } = reducers[reducer];
    const fds = Array.isArray(field) ? field : [field];
    const fields = fds.filter(Boolean);
    const collName = String('mp_').concat(
        hashCoerce.hash({ reducer, fields }),
    );
    const options = {
        query: filter,
        finalize,
        out: {
            replace: collName,
        },
        scope: {
            fields,
        },
    };
    const connectionStringURI = this.getParam(
        'connectionStringURI',
        data.connectionStringURI || '',
    );
    const db = await mongoDatabase(connectionStringURI);
    const collection = db.collection('publishedDataset');

    const result = await collection.mapReduce(map, reduce, options);

    const total = await result.count();

    const findFilter = {};

    if (minValue) {
        const minFilter = {
            $gte: Number(minValue),
        };
        findFilter[fieldname('value')] = {
            ...minFilter,
        };
    }
    if (maxValue) {
        const maxFilter = {
            $lte: Number(maxValue),
        };
        findFilter[fieldname('value')] = {
            ...maxFilter,
        };
    }
    const [order, dir] = String(orderBy).split('/');
    const sort = order && dir ? ({
        [fieldname(order)]: dir === 'asc' ? 1 : -1,
    }) : ({});
    const cursor = result.find(findFilter);
    const count = await cursor.count();

    if (total === 0 || count === 0) {
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
        .skip(skip)
        .limit(limit)
        .stream()
        .on('error', (e) => feed.stop(e))
        .pipe(ezs('assign', { path, value }));
    await feed.flow(stream);
};

export default {
    reduceQuery: createFunction(),
};
