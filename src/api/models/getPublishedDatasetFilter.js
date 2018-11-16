import compose from 'lodash.compose';

export const addMatchToFilters = (match, searchableFieldNames) => filters => {
    if (!match || !searchableFieldNames || !searchableFieldNames.length) {
        return filters;
    }

    return {
        ...filters,
        $text: { $search: match },
    };
};

export const getValueQueryFragment = (name, value, inverted) => {
    if (Array.isArray(value) && value.length > 1) {
        return {
            [inverted ? '$nor' : '$or']: value.map(v => ({
                [`versions.${name}`]: v,
            })),
        };
    }

    const queryValue = Array.isArray(value) ? value[0] : value;

    return {
        [`versions.${name}`]: inverted ? { $ne: queryValue } : queryValue,
    };
};

export const addFacetToFilters = (
    facets,
    facetFieldNames,
    invertedFacets = [],
) => filters => {
    if (
        !facets ||
        !Object.keys(facets).length ||
        !facetFieldNames ||
        !facetFieldNames.length
    ) {
        return filters;
    }

    return {
        ...filters,
        $and: facetFieldNames.reduce((acc, name) => {
            if (!facets[name]) return acc;

            return [
                ...acc,
                getValueQueryFragment(
                    name,
                    facets[name],
                    invertedFacets.indexOf(name) !== -1,
                ),
            ];
        }, []),
    };
};

export const addKeyToFilters = (key, value) => filters => {
    if (!value) {
        return filters;
    }

    return {
        ...filters,
        [key]: value,
    };
};

const getPublishedDatasetFilter = ({
    uri,
    match,
    searchableFieldNames,
    facets,
    facetFieldNames,
    invertedFacets,
}) =>
    compose(
        addKeyToFilters('uri', uri),
        addMatchToFilters(match, searchableFieldNames),
        addFacetToFilters(facets, facetFieldNames, invertedFacets),
    )({ removedAt: { $exists: false } });

export default getPublishedDatasetFilter;
