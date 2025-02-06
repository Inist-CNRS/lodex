import chunk from 'lodash/chunk';
import { getCreatedCollection } from './utils';

export default async (db) => {
    const collection = await getCreatedCollection(db, 'publishedFacet');

    collection.insertBatch = (documents) =>
        chunk(documents, 100).map((data) => collection.insertMany(data));

    collection.insertFacet = (field, values) =>
        collection.insertBatch(
            values.map((value) => ({
                field,
                ...value,
            })),
        );

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
