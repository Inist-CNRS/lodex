import chunk from 'lodash/chunk';
import { getCreatedCollection } from './utils';

export default async (db: any) => {
    const collection = await getCreatedCollection(db, 'publishedFacet');

    collection.insertBatch = (documents: any) =>
        chunk(documents, 100).map((data: any) => collection.insertMany(data));

    collection.insertFacet = (field: any, values: any) =>
        collection.insertBatch(
            values.map((value: any) => ({
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
    }: any) =>
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
    }: any) => {
        const filters = { field };

        if (filter) {
            // @ts-expect-error TS(2339): Property 'value' does not exist on type '{ field: ... Remove this comment to see the full error message
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

    collection.countValuesForField = (field: any, filter: any) => {
        const filters = { field };

        if (filter) {
            // @ts-expect-error TS(2339): Property 'value' does not exist on type '{ field: ... Remove this comment to see the full error message
            filters.value = { $regex: `.*${filter}.*`, $options: 'i' };
        }

        return collection.count(filters);
    };

    return collection;
};
