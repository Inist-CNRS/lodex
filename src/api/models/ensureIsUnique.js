import memoize from 'lodash.memoize';

export const ensureConcatenationIsUnique = collection => async (fieldNames) => {
    const $concat = fieldNames.map(v => `$${v}`);
    const { distinct } = await collection.aggregate([
        { $project: { uri: { $concat } } },
        { $group: { _id: null, uris: { $addToSet: '$uri' } } },
        { $project: { distinct: { $size: '$uris' } } },
    ]);

    return distinct;
};

const ensure = collection => async (fieldName) => {
    const count = await collection.count();
    const distinct = Array.isArray(fieldName) ?
            await ensureConcatenationIsUnique(collection)(fieldName)
        :
            (await collection.distinct(fieldName)).length;

    return distinct === count;
};

export default collection => memoize(ensure(collection));
