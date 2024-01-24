import _ from 'lodash';
import mongoDatabase from './mongoDatabase';

/**
 * Take 3 parameters and create a join query (one to many, on sub-ressource)
 *
 * The input object must contain a `connectionStringURI` property, valued with
 * the connection string to MongoDB.
 *
 * @name LodexJoinQuery
 * @param {String}  [collection="publishedDataset"]  collection to use
 * @param {Object}  [referer]       data injected into every result object
 * @param {Object}  [filter={}]     MongoDB filter
 * @param {String}  [sortOn]        Field to sort on
 * @param {String}  [sortOrder]     Oder to sort
 * @param {String}  [matchField]    Lodex field, containing matchable element
 * @param {String}  [matchValue]    Value used with the match field to get items
 * @param {String}  [joinField]     Lodex field used for the join request
 * @param {Object}  [limit]         limit the result
 * @param {Object}  [skip]          limit the result
 * @returns {Object}
 */
export default async function LodexJoinQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const { ezs } = this;
    const referer = this.getParam('referer', data.referer);

    const matchField = this.getParam('matchField', data.matchField || '');
    const matchValue = this.getParam('matchValue', data.matchValue || '');
    const joinField = this.getParam('joinField', data.joinField || '');
    const sortOn = this.getParam('sortOn', data.sortOn || false);
    const sortOrder = this.getParam('sortOrder', data.sortOrder || 'asc');

    const filter = this.getParam('filter', data.filter || {});

    const collectionName = this.getParam('collection', data.collection || 'publishedDataset');
    const limit = Number(this.getParam('limit', data.limit || 1000000));
    const skip = Number(this.getParam('skip', data.skip || 0));
    const connectionStringURI = this.getParam(
        'connectionStringURI', data.connectionStringURI || '',
    );
    const db = await mongoDatabase(connectionStringURI);
    const collection = db.collection(collectionName);

    if (matchField === '' || joinField === '') return feed.send({ total: 0 });

    const aggregateQuery = [
        { $match: { [`versions.0.${matchField}`]: matchValue, removedAt: { $exists: false } } },
        { $project: { _id: 1, [`versions.${matchField}`]: 1 } },
        { $unwind: '$versions' },
        { $project: { items: `$versions.${matchField}` } },
    ];

    const aggregateCursor = await collection.aggregate(aggregateQuery);

    let hitsTotal = 0;
    const results = {};
    await aggregateCursor
        .forEach((row) => {
            hitsTotal += 1;
            _.get(row, 'items', []).forEach((item) => {
                if (item !== matchValue) {
                    const itemValue = _.get(results, item);
                    if (itemValue) {
                        _.set(results, item, itemValue + 1);
                    } else {
                        _.set(results, item, 1);
                    }
                }
            });
        });

    const findQuery = {
        [`versions.${joinField}`]: { $in: _.keys(results) },
        ..._.omit(filter, ['removedAt', 'subresourceId']),
    };

    let findCursor = await collection.find(findQuery);

    if (sortOn !== false) {
        findCursor = findCursor.sort(`versions.${sortOn}`, sortOrder === 'desc' ? -1 : 1).allowDiskUse();
    }

    const findTotal = await findCursor.count();

    if (findTotal === 0) {
        return feed.send({ total: 0 });
    }

    const path = ['total'];
    const value = [findTotal];

    path.push('hitsTotal');
    value.push(hitsTotal);

    if (referer) {
        path.push('referer');
        value.push(referer);
    }

    const stream = findCursor
        .skip(skip)
        .limit(limit)
        .stream()
        .on('error', (e) => feed.stop(e))
        .pipe(ezs('assign',
            {
                path,
                value,
            }))
        .pipe(ezs((input, output) => {
            if (input == null) {
                output.end();
                return;
            }
            const title = _.chain(input)
                .get('versions')
                .last()
                .get(joinField)
                .value();
            const count = _.get(results, title);
            _.set(input, 'count', count);
            output.send(input);
        }));

    await feed.flow(stream);
}
