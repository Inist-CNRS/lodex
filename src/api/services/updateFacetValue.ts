import difference from 'lodash/difference';

const removeOldValue =
    (publishedFacet: any, field: any) => async (oldValue: any) => {
        const updatedFacet = await publishedFacet.findOneAndUpdate(
            { field, value: oldValue },
            { $inc: { count: -1 } },
            { returnDocument: 'after' },
        );

        if (updatedFacet.count <= 0) {
            await publishedFacet.deleteOne(updatedFacet);
        }
    };

const addNewValue =
    (publishedFacet: any, field: any) => async (newValue: any) => {
        await publishedFacet.updateOne(
            { field, value: newValue },
            { $inc: { count: 1 } },
            { upsert: true },
        );
    };

const updateFacetValue =
    (publishedFacet: any) =>
    async ({ field, oldValue, newValue }: any) => {
        const oldValues = Array.isArray(oldValue) ? oldValue : [oldValue];
        const newValues = Array.isArray(newValue) ? newValue : [newValue];

        await Promise.all(
            difference(oldValues, newValue).map(
                removeOldValue(publishedFacet, field),
            ),
        );

        await Promise.all(
            difference(newValues, oldValues).map(
                addNewValue(publishedFacet, field),
            ),
        );
    };

export default updateFacetValue;
