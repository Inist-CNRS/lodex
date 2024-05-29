import chunk from 'lodash/chunk';
import groupBy from 'lodash/groupBy';
import omit from 'lodash/omit';
import uniqWith from 'lodash/uniqWith';
import JSONStream from 'jsonstream';
import { Transform } from 'stream';
import { ObjectID } from 'mongodb';

import { URI_FIELD_NAME, moveUriToFirstPosition } from '../../common/uris';
import countNotUnique from './countNotUnique';
import countNotUniqueSubresources from './countNotUniqueSubresources';

export default (db) => {
    const collection = db.collection('dataset');
    collection.insertBatch = (documents) => {
        return Promise.all(
            chunk(documents, 100).map((data) => {
                const orderedData = moveUriToFirstPosition(data);
                return collection.insertMany(orderedData, {
                    forceServerObjectId: true,
                    w: 1,
                });
            }),
        );
    };
    collection.getExcerpt = async (filter) => {
        const result = await collection
            .find(filter)
            .sort({ $natural: 1 })
            .limit(100)
            .toArray();
        // choisr parmi les 100 premiers documents, ceux ayants le plus de champs
        const result2 = result
            .map((item) => {
                const validKeys = Object.keys(item).filter((key) => {
                    if (
                        item[key] === undefined ||
                        item[key] === null ||
                        item[key] === ''
                    ) {
                        return false;
                    }
                    return true;
                });
                return { ...item, __nb: validKeys.length };
            })
            .sort((x, y) => y.__nb - x.__nb);
        return result2.splice(0, 8).map((item) => {
            delete item.__nb;
            return item;
        });
    };

    collection.findLimitFromSkip = (limit, skip, query = {}, sortBy, sortDir) =>
        collection
            .find(query)
            .sort(
                sortBy && sortDir
                    ? { [sortBy]: sortDir === 'ASC' ? 1 : -1 }
                    : {},
            )
            .skip(skip)
            .limit(limit)
            .toArray();

    collection.countWithoutUri = () =>
        collection.count({ uri: { $exists: false } });

    collection.countNotUnique = countNotUnique(collection);

    collection.countNotUniqueSubresources =
        countNotUniqueSubresources(collection);

    collection.ensureIsUnique = async (fieldName) =>
        (await collection.countNotUnique(fieldName)) === 0;

    collection.bulkUpdate = async (items, getFilter, upsert = false) => {
        if (items.length) {
            return await collection.bulkWrite(
                items.map((item) => ({
                    updateOne: {
                        filter: getFilter(item),
                        update: { $set: item },
                        upsert,
                    },
                })),
            );
        }
    };

    collection.upsertBatch = (documents, getFilter) =>
        Promise.all(
            chunk(documents, 100).map((data) =>
                collection.bulkUpdate(data, getFilter, true),
            ),
        );

    collection.bulkUpsertByUri = (data) => {
        const { withUri, withoutUri } = groupBy(data, (item) =>
            typeof item.uri === 'undefined' || item.uri === ''
                ? 'withoutUri'
                : 'withUri',
        );

        return Promise.all(
            [
                withUri &&
                    collection.upsertBatch(withUri, (item) => ({
                        uri: item[URI_FIELD_NAME],
                    })),
                withoutUri &&
                    collection.insertBatch(
                        // Unset uri that is set empty in the stream loader
                        // @TODO: Find where the uri is set to "" and delete it
                        withoutUri.map((item) => omit(item, [URI_FIELD_NAME])),
                    ),
            ].filter((x) => x),
        );
    };

    collection.dumpAsJsonStream = async () => {
        const omitMongoId = new Transform({ objectMode: true });
        omitMongoId._transform = function (data, enc, cb) {
            this.push(omit(data, ['_id']));
            cb();
        };

        return (await collection.find({}).stream())
            .pipe(omitMongoId)
            .pipe(JSONStream.stringify());
    };

    collection.dumpAsJsonLStream = async () => {
        const omitMongoId = new Transform({ objectMode: true });
        omitMongoId._transform = function (data, enc, cb) {
            this.push(JSON.stringify(omit(data, ['_id'])).concat('\n'));
            cb();
        };

        return (await collection.find({}).stream()).pipe(omitMongoId);
    };

    collection.removeAttribute = async (attribute) =>
        collection.update({}, { $unset: { [attribute]: 1 } }, { multi: true });

    collection.findBy = async (fieldName, value) => {
        if (!(await collection.ensureIsUnique(fieldName))) {
            throw new Error(
                `${fieldName} value is not unique for every document`,
            );
        }

        const results = await collection
            .find({ [fieldName]: value })
            .limit(1)
            .toArray();

        return results[0];
    };

    collection.getColumns = async () => {
        const result = await collection
            .find({})
            .limit(30) // The first 30 documents are considered representative of the entire dataset.
            .toArray();
        const columns = [];
        result.forEach((item) => {
            Object.keys(item).forEach((key) => {
                columns.push({ key, type: typeof item[key] });
            });
        });
        return uniqWith(columns, (x, y) => x.key === y.key);
    };

    collection.indexColumns = async () => {
        const aggregation = await collection
            .aggregate([
                { $project: { keyValue: { $objectToArray: '$$ROOT' } } },
                { $unwind: '$keyValue' },
                {
                    $group: {
                        _id: null,
                        keys: { $addToSet: '$keyValue.k' },
                    },
                },
            ])
            .toArray();
        if (aggregation[0]) {
            for (const key of aggregation[0].keys) {
                try {
                    await collection.createIndex({ [key]: 1 });
                } catch {
                    console.error(`Failed to index ${key}`);
                }
            }
        } else {
            console.warn(
                'Unable to create datagrid indexes, columns are invalid.',
            );
        }
    };

    collection.deleteOne = async (id) =>
        collection.remove({ _id: new ObjectID(id) });

    return collection;
};
