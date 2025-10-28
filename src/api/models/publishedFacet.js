import chunk from 'lodash/chunk';
import { getCreatedCollection } from './utils';
import { createDiacriticSafeContainRegex } from '../services/createDiacriticSafeContainRegex';

export default async (db) => {
    const collection = await getCreatedCollection(db, 'publishedFacet');

    /**
     * Batch insertions
     */
    collection.insertBatch = async (documents) => {
        for (const data of chunk(documents, 100)) {
            await collection.insertMany(data);
        }
    };

    collection.insertFacet = (field, values) =>
        collection.insertBatch(values.map((value) => ({ field, ...value })));

    /**
     * Retrieves a page of results with skip/limit/sort
     */
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
        if (filter !== undefined && filter !== null && filter !== '') {
            const trimmedFilter = filter.trim();
            if (trimmedFilter !== '') {
                filters.value = createDiacriticSafeContainRegex(trimmedFilter);
            }
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
        if (filter !== undefined && filter !== null && filter !== '') {
            const trimmedFilter = filter.trim();
            if (trimmedFilter !== '') {
                filters.value = createDiacriticSafeContainRegex(trimmedFilter);
            }
        }
        return collection.count(filters);
    };

    return collection;
};
