import type { Filter } from 'mongodb';
import { createDiacriticSafeContainRegex } from '../../services/createDiacriticSafeContainRegex';

export const buildQuery = <
    Document extends Record<string, unknown> = Record<string, unknown>,
>(
    filterBy?: keyof Document,
    filterOperator?: 'is' | '=' | '>' | '<' | string,
    filterValue?: any,
): Filter<Document> => {
    if (!filterValue || !filterBy || !filterOperator) {
        return {};
    }
    switch (filterOperator) {
        case 'is':
            return {
                [filterBy]: { $eq: filterValue === 'true' },
            } as Filter<Document>;
        case '=':
            return {
                [filterBy]: { $eq: parseFloat(filterValue) },
            } as Filter<Document>;
        case '>':
            return {
                [filterBy]: { $gt: parseFloat(filterValue) },
            } as Filter<Document>;
        case '<':
            return {
                [filterBy]: { $lt: parseFloat(filterValue) },
            } as Filter<Document>;
        default:
            return {
                [filterBy]: createDiacriticSafeContainRegex(filterValue),
            } as Filter<Document>;
    }
};
