import compose from 'lodash.compose';

export const literalToQueryString = params => Object
    .keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

export const addFacetListToLiteral = facetList => (literal = {}) =>
    facetList.reduce((acc, facet) => ({
        ...acc,
        [facet.field.name]: facet.value,
    }), literal);

export const addKeyToLiteral = (key, value) => (literal = {}) => {
    if (!value) {
        return literal;
    }

    return {
        ...literal,
        [key]: value,
    };
};

export default({ match, facets, sort, page, perPage, uri } = {}) =>
    compose(
        literalToQueryString,
        addFacetListToLiteral(facets),
        addKeyToLiteral('match', match),
        addKeyToLiteral('sortBy', sort.sortBy),
        addKeyToLiteral('sortDir', sort.sortDir),
        addKeyToLiteral('page', page),
        addKeyToLiteral('perPage', perPage),
        addKeyToLiteral('uri', uri),
    )({
        ...sort,
    });
