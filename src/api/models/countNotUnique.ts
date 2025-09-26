// @ts-expect-error TS(2792): Cannot find module 'lodash/memoize'. Did you mean ... Remove this comment to see the full error message
import memoize from 'lodash/memoize';

export const countUniqueConcatenation =
    (collection: any) => async (fieldNames: any) => {
        const $concat = fieldNames.map((v: any) => `$${v}`);
        const [{ distinct }] = await collection
            .aggregate([
                { $project: { uri: { $concat } } },
                { $group: { _id: null, uris: { $addToSet: '$uri' } } },
                { $project: { distinct: { $size: '$uris' } } },
            ])
            .toArray();
        return distinct;
    };

const countNotUnique = (collection: any) => async (fieldName: any) => {
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

export default (collection: any) => memoize(countNotUnique(collection));
