import chunk from 'lodash.chunk';

export default db => {
    const collection = db.collection('publishedFacet');

    collection.insertBatch = documents =>
        chunk(documents, 100).map(data => collection.insertMany(data));

    collection.insertFacet = (field, values) =>
        collection.insertBatch(
            values.map(value => ({
                field,
                ...value,
            })),
        );

    collection.findLimitFromSkip = (limit, skip, filter) =>
        collection
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ value: 1 })
            .toArray();

    collection.findValuesForField = (field, filter, page = 0, perPage = 10) => {
        const filters = { field };

        if (filter) {
            filters.value = { $regex: `.*${filter}.*` };
        }

        return collection.findLimitFromSkip(
            parseInt(perPage, 10),
            page * perPage,
            filters,
        );
    };

    collection.countValuesForField = (field, filter) => {
        const filters = { field };

        if (filter) {
            filters.value = { $regex: `.*${filter}.*` };
        }

        return collection.count(filters);
    };

    return collection;
};
