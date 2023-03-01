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

    collection.findLimitFromSkip = ({
        limit,
        skip,
        filters,
        sortBy = 'count',
        sortDir = 'DESC',
    }) =>
        collection
            .find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortDir === 'ASC' ? 1 : -1, _id: 1 })
            .toArray();

    collection.findValuesForField = ({
        field,
        filter,
        page = 0,
        perPage = 10,
        sortBy,
        sortDir,
    }) => {
        const filters = { field };

        if (filter) {
            filters.value = { $regex: `.*${filter}.*`, $options: 'i' };
        }

        return collection.findLimitFromSkip({
            limit: parseInt(perPage, 10),
            skip: page * perPage,
            filters,
            sortBy,
            sortDir,
        });
    };

    collection.countValuesForField = (field, filter) => {
        const filters = { field };

        if (filter) {
            filters.value = { $regex: `.*${filter}.*`, $options: 'i' };
        }

        return collection.count(filters);
    };

    return collection;
};
