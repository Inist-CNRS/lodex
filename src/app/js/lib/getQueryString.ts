import compose from 'lodash/flowRight';
import qs from 'qs';

export const addLiteralToLiteral =
    (facets = {}) =>
    (literal = {}) => ({
        ...literal,
        ...facets,
    });

export const addKeyToLiteral =
    (key: string, value: unknown) =>
    (literal = {}) => {
        if (!value) {
            return literal;
        }

        return {
            ...literal,
            [key]: value,
        };
    };

export default ({
    match,
    facets,
    params,
    invertedFacets,
    sort = {},
    page,
    perPage,
    limit,
    skip,
    uri,
    filter = {},
    locale,
}: {
    match?: string;
    facets?: Record<string, string>;
    params?: Record<string, string>;
    invertedFacets?: Record<string, string>;
    sort?: { sortBy?: string; sortDir?: string };
    page?: number;
    perPage?: number;
    limit?: number;
    skip?: number;
    uri?: string;
    filter?: { columnField?: string; operatorValue?: string; value?: string };
    locale?: string;
} = {}) =>
    compose(
        qs.stringify,
        addLiteralToLiteral(facets),
        addLiteralToLiteral(params),
        addKeyToLiteral('invertedFacets', invertedFacets),
        addKeyToLiteral('match', match),
        addKeyToLiteral('sortBy', sort.sortBy),
        addKeyToLiteral('sortDir', sort.sortDir),
        addKeyToLiteral('page', page),
        addKeyToLiteral('perPage', perPage),
        addKeyToLiteral('perPage', perPage),
        addKeyToLiteral('limit', limit),
        addKeyToLiteral('skip', skip),
        addKeyToLiteral('uri', uri),
        addKeyToLiteral('filterBy', filter.columnField),
        addKeyToLiteral('filterOperator', filter.operatorValue),
        addKeyToLiteral('filterValue', filter.value),
        addKeyToLiteral('locale', locale),
    )({});
