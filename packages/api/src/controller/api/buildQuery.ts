import type { FindOptions } from 'mongodb';
import { createDiacriticSafeContainRegex } from '../../services/createDiacriticSafeContainRegex';

export const buildQuery = <
    Document extends Record<string, unknown> = Record<string, unknown>,
>(
    filterBy?: keyof Document,
    filterOperator?: 'is' | '=' | '>' | '<' | string,
    filterValue?: any,
): FindOptions<Document> => {
    if (!filterValue || !filterBy || !filterOperator) {
        return {};
    }
    switch (filterOperator) {
        case 'is':
            return { [filterBy]: { $eq: filterValue === 'true' } };
        case '=':
            return { [filterBy]: { $eq: parseFloat(filterValue) } };
        case '>':
            return { [filterBy]: { $gt: parseFloat(filterValue) } };
        case '<':
            return { [filterBy]: { $lt: parseFloat(filterValue) } };
        default:
            return {
                [filterBy]: createDiacriticSafeContainRegex(filterValue),
            };
    }
};
