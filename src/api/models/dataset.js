import chunk from 'lodash.chunk';
import groupBy from 'lodash.groupby';
import omit from 'lodash.omit';
import JSONStream from 'jsonstream';
import { Transform } from 'stream';

import { URI_FIELD_NAME } from '../../common/uris';
import countNotUnique from './countNotUnique';
import countNotUniqueSubresources from './countNotUniqueSubresources';

export default db => {
    const collection = db.collection('dataset');
    collection.insertBatch = documents =>
        chunk(documents, 100).map(data =>
            collection.insertMany(data, {
                forceServerObjectId: true,
                w: 1,
            }),
        );
    collection.getExcerpt = filter =>
        collection
            .find(filter)
            .limit(8)
            .toArray();
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

    collection.countNotUniqueSubresources = countNotUniqueSubresources(
        collection,
    );

    collection.ensureIsUnique = async fieldName =>
        (await collection.countNotUnique(fieldName)) === 0;

    collection.bulkUpdate = async (items, getFilter, upsert = false) => {
        if (items.length) {
            collection.bulkWrite(
                items.map(item => ({
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
            chunk(documents, 100).map(data =>
                collection.bulkUpdate(data, getFilter, true),
            ),
        );

    collection.bulkUpsertByUri = data => {
        const { withUri, withoutUri } = groupBy(data, item =>
            typeof item.uri === 'undefined' || item.uri === ''
                ? 'withoutUri'
                : 'withUri',
        );

        return Promise.all(
            [
                withUri &&
                    collection.upsertBatch(withUri, item => ({
                        uri: item[URI_FIELD_NAME],
                    })),
                withoutUri &&
                    collection.insertBatch(
                        // Unset uri that is set empty in the stream loader
                        // @TODO: Find where the uri is set to "" and delete it
                        withoutUri.map(item => omit(item, [URI_FIELD_NAME])),
                    ),
            ].filter(x => x),
        );
    };

    collection.dumpAsJsonStream = async () => {
        const omitMongoId = new Transform({ objectMode: true });
        omitMongoId._transform = function(data, enc, cb) {
            this.push(omit(data, ['_id']));
            cb();
        };

        return (await collection.find({}).stream())
            .pipe(omitMongoId)
            .pipe(JSONStream.stringify());
    };

    collection.removeAttribute = async attribute =>
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
        const firstLine = await collection.findOne();
        const columns = [];
        Object.keys(firstLine).forEach(key => {
            columns.push({ key, type: typeof firstLine[key] });
        });
        return columns;
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
        for (const key of aggregation[0].keys) {
            try {
                await collection.createIndex({ [key]: 1 });
            } catch {
                console.error(`Failed to index ${key}`);
            }
        }
    };

    return collection;
};
