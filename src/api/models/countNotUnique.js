import memoize from 'lodash/memoize';

export const countUniqueConcatenation = (collection) => async (fieldNames) => {
    const $concat = fieldNames.map((v) => `$${v}`);
    const [{ distinct }] = await collection
        .aggregate([
            { $project: { uri: { $concat } } },
            { $group: { _id: null, uris: { $addToSet: '$uri' } } },
            { $project: { distinct: { $size: '$uris' } } },
        ])
        .toArray();
    return distinct;
};

const countNotUnique = (collection) => async (fieldName) => {
    const count = await collection.count();
    const distinct = Array.isArray(fieldName)
        ? await countUniqueConcatenation(collection)(fieldName)
        : // Distinct can cause an OOM on big datasets so we use aggregate here instead
          (
              await collection
                  .aggregate([{ $group: { _id: `$${fieldName}` } }])
                  .toArray()
          ).length;

    return count - distinct;
};

export default (collection) => memoize(countNotUnique(collection));
