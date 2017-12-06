import compose from 'lodash.compose';
import qs from 'qs';

export const addFacetListToLiteral = facets => (literal = {}) => ({
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

export default (
    {
        match,
        facets,
        invertedFacets,
        sort,
        page,
        perPage,
        limit,
        skip,
        uri,
    } = {},
) =>
    compose(
        qs.stringify,
        addFacetListToLiteral(facets),
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
    )({
        ...sort,
    });
