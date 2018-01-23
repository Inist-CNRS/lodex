const updateFacetValue = publishedFacet => async ({
    field,
    oldValue,
    newValue,
}) => {
    const { value: updatedFacet } = await publishedFacet.findOneAndUpdate(
        { field, value: oldValue },
        { $inc: { count: -1 } },
        { returnOriginal: false },
    );

    if (updatedFacet.count <= 0) {
        await publishedFacet.remove(updatedFacet);
    }

    await publishedFacet.update(
        { field, value: newValue },
        { $inc: { count: 1 } },
        { upsert: true },
    );
};

export default updateFacetValue;
