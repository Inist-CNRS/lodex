import chunk from 'lodash.chunk';
import groupBy from 'lodash.groupby';
import omit from 'lodash.omit';

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
    collection.getExcerpt = () =>
        collection
            .find()
            .limit(8)
            .toArray();
    collection.findLimitFromSkip = (limit, skip, query = {}) =>
        collection
            .find(query)
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

    collection.bulkUpdate = async (items, getFilter, upsert = false) =>
        collection.bulkWrite(
            items.map(item => ({
                updateOne: {
                    filter: getFilter(item),
                    update: { $set: item },
                    upsert,
                },
            })),
        );

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
    return collection;
};
