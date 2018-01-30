import difference from 'lodash.difference';

const removeOldValue = (publishedFacet, field) => async oldValue => {
    const { value: updatedFacet } = await publishedFacet.findOneAndUpdate(
        { field, value: oldValue },
        { $inc: { count: -1 } },
        { returnOriginal: false },
    );

    if (updatedFacet.count <= 0) {
        await publishedFacet.remove(updatedFacet);
    }
};

const addNewValue = (publishedFacet, field) => async newValue => {
    await publishedFacet.update(
        { field, value: newValue },
        { $inc: { count: 1 } },
        { upsert: true },
    );
};

const updateFacetValue = publishedFacet => async ({
    field,
    oldValue,
    newValue,
}) => {
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
