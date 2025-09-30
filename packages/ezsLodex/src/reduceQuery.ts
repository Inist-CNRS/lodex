import hasher from 'node-object-hash';
import mongoDatabase from './mongoDatabase.js';
import reducers from './reducers/index.js';

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
export const createFunction = () =>
    ((async function LodexReduceQuery(this: any, data: any, feed: any) {
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
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (!reducers[reducer]) {
            throw new Error(`Unknown reducer '${reducer}'`);
        }

        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const { map, reduce, finalize, fieldname } = reducers[reducer];
        const fds = Array.isArray(field) ? field : [field];
        const fields = fds.filter(Boolean);
        const collName = String('mp_').concat(
            hashCoerce.hash({ reducer, fields }),
        );

        const connectionStringURI = this.getParam(
            'connectionStringURI',
            data.connectionStringURI || '',
        );
        const db = await mongoDatabase(connectionStringURI);
        const command = {
            mapReduce: 'publishedDataset',
            map: map.toString(),
            reduce: reduce.toString(),
            query: filter,
            finalize: finalize.toString(),
            out: {
                replace: collName,
            },
            scope: {
                fields,
            },
        };

        const { result: collectionResult, ok } = await db.command(command);
        if (ok !== 1) {
            return feed.stop(new Error('MongoDB command return an error'));
        }

        const result = await db.collection(collectionResult);
        const total = await result.estimatedDocumentCount();

        const findFilter = {};

        if (minValue) {
            const minFilter = {
                $gte: Number(minValue),
            };
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            findFilter[fieldname('value')] = {
                ...minFilter,
            };
        }
        if (maxValue) {
            const maxFilter = {
                $lte: Number(maxValue),
            };
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            findFilter[fieldname('value')] = {
                ...maxFilter,
            };
        }
        const [order, dir] = String(orderBy).split('/');
        const sort =
            order && dir
                ? {
                      [fieldname(order)]: dir === 'asc' ? 1 : -1,
                  }
                : {};
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
            .on('error', (e: any) => feed.stop(e))
            .pipe(ezs('assign', { path, value }));

        feed.flow(stream);
    }));

export default {
    reduceQuery: createFunction(),
};
