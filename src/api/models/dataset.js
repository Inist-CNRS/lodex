import chunk from 'lodash.chunk';

import countNotUnique from './countNotUnique';

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
            .limit(6)
            .toArray();
    collection.findLimitFromSkip = (limit, skip) =>
        collection
            .find()
            .skip(skip)
            .limit(limit)
            .toArray();

    collection.countNotUnique = countNotUnique(collection);

    collection.ensureIsUnique = async fieldName =>
        (await collection.countNotUnique(fieldName)) === 0;

    collection.findBy = async (fieldName, value) => {
        if (!await collection.ensureIsUnique(fieldName)) {
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
