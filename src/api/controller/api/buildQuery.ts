import { createDiacriticSafeContainRegex } from '../../services/createDiacriticSafeContainRegex';

export const buildQuery = (
    filterBy: any,
    filterOperator: any,
    filterValue: any,
) => {
    if (!filterValue) {
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
