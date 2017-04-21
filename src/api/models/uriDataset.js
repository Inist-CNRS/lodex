import chunk from 'lodash.chunk';

import countNotUnique from './countNotUnique';

export default (db) => {
    const collection = db.collection('uriDataset');

    collection.insertBatch = documents =>
        Promise.all(chunk(documents, 1000).map(data => collection.insertMany(data, {
            forceServerObjectId: true,
            w: 1,
        })));

    collection.findLimitFromSkip = async (limit, skip) => {
        const fields = Object.keys(await collection.findOne()).filter(name => name !== '_id');

        return collection.aggregate([
            { $group: {
                _id: '$uri',
                ...fields.reduce((acc, name) => ({
                    ...acc,
                    [name]: { $first: `$${name}` },
                }), {}),
            } },
            { $skip: skip },
            { $limit: limit },
        ]).toArray();
    };

    collection.countNotUnique = countNotUnique(collection);

    collection.ensureIsUnique = async fieldName =>
        (await collection.countNotUnique(fieldName)) === 0;

    collection.findBy = async (fieldName, value) => {
        if (!await collection.ensureIsUnique(fieldName)) {
            throw new Error(`${fieldName} value is not unique for every document`);
        }

        const results = await collection.find({ [fieldName]: value }).limit(1).toArray();

        return results[0];
    };
    return collection;
};
