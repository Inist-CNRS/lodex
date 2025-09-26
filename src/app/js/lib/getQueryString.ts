// @ts-expect-error TS7016
import compose from 'lodash/flowRight';
// @ts-expect-error TS7016
import qs from 'qs';

export const addLiteralToLiteral =
    (facets = {}) =>
    (literal = {}) => ({
        ...literal,
        ...facets,
    });

export const addKeyToLiteral =
    // @ts-expect-error TS7006
    (key, value) =>
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
    // @ts-expect-error TS2525
    match,
    // @ts-expect-error TS2525
    facets,
    // @ts-expect-error TS2525
    params,
    // @ts-expect-error TS2525
    invertedFacets,
    sort = {},
    // @ts-expect-error TS2525
    page,
    // @ts-expect-error TS2525
    perPage,
    // @ts-expect-error TS2525
    limit,
    // @ts-expect-error TS2525
    skip,
    // @ts-expect-error TS2525
    uri,
    filter = {},
    // @ts-expect-error TS2525
    locale,
} = {}) =>
    compose(
        qs.stringify,
        addLiteralToLiteral(facets),
        addLiteralToLiteral(params),
        addKeyToLiteral('invertedFacets', invertedFacets),
        addKeyToLiteral('match', match),
        // @ts-expect-error TS2339
        addKeyToLiteral('sortBy', sort.sortBy),
        // @ts-expect-error TS2339
        addKeyToLiteral('sortDir', sort.sortDir),
        addKeyToLiteral('page', page),
        addKeyToLiteral('perPage', perPage),
        addKeyToLiteral('perPage', perPage),
        addKeyToLiteral('limit', limit),
        addKeyToLiteral('skip', skip),
        addKeyToLiteral('uri', uri),
        // @ts-expect-error TS2339
        addKeyToLiteral('filterBy', filter.columnField),
        // @ts-expect-error TS2339
        addKeyToLiteral('filterOperator', filter.operatorValue),
        // @ts-expect-error TS2339
        addKeyToLiteral('filterValue', filter.value),
        addKeyToLiteral('locale', locale),
    )({});
