import compose from 'lodash/compose';
import qs from 'qs';

export const addLiteralToLiteral = (facets = {}) => (literal = {}) => ({
    ...literal,
    ...facets,
});

export const addKeyToLiteral = (key, value) => (literal = {}) => {
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
