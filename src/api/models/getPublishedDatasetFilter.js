import compose from 'lodash/flowRight';

export const addMatchToFilters = (match, searchableFieldNames) => (filters) => {
    if (!match || !searchableFieldNames || !searchableFieldNames.length) {
        return filters;
    }

    return {
        ...filters,
        $text: { $search: match },
    };
};

export const addRegexToFilters = (match, searchableFieldNames) => (filters) => {
    if (!match || !searchableFieldNames || !searchableFieldNames.length) {
        return filters;
    }

    const regexMatch = new RegExp(match);

    return {
        ...filters,
        $or: searchableFieldNames.map((name) => ({
            [`versions.${name}`]: { $regex: regexMatch, $options: 'i' },
        })),
    };
};

export const addFieldsToFilters = (matchableFields) => (filters) => {
    if (!matchableFields) {
        return filters;
    }

    const matchableFieldNames = Object.keys(matchableFields);
    if (!matchableFieldNames.length) {
        return filters;
    }

    return {
        ...filters,
        $or: matchableFieldNames.map((fieldName) => ({
            [`versions.${fieldName}`]: matchableFields[fieldName],
        })),
    };
};

export const getValueQueryFragment = (name, value, inverted) => {
    if (Array.isArray(value) && value.length > 1) {
        return {
            [inverted ? '$nor' : '$or']: value.map((v) => ({
                [`versions.${name}`]: v,
            })),
        };
    }

    const queryValue = Array.isArray(value) ? value[0] : value;

    return {
        [`versions.${name}`]: inverted ? { $ne: queryValue } : queryValue,
    };
};

export const addFacetToFilters =
    (facets, facetFieldNames, invertedFacets = []) =>
    (filters) => {
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

export const getUriFilter = ({ resourceUris, excludedResourceUris }) => {
    if (!resourceUris && !excludedResourceUris) {
        return {};
    }

    return {
        uri: {
            ...(resourceUris ? { $in: resourceUris } : {}),
            ...(excludedResourceUris ? { $nin: excludedResourceUris } : {}),
        },
    };
};

export const addFilters = (filters) => (previewFilters) => {
    if (!filters) {
        return previewFilters;
    }

    return {
        ...previewFilters,
        ...(filters.resourceUris || filters.excludedResourceUris
            ? getUriFilter(filters)
            : {}),
    };
};

export const addKeyToFilters = (key, value) => (filters) => {
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
    matchableFields,
    searchableFieldNames,
    facets,
    facetFieldNames,
    invertedFacets,
    filters,
    regexSearch = false,
    excludeSubresources = false,
}) => {
    const addSearchFilters = regexSearch
        ? addRegexToFilters
        : addMatchToFilters;

    const publishedDatasetFilters = compose(
        addKeyToFilters('uri', uri),
        addFieldsToFilters(matchableFields),
        addSearchFilters(match, searchableFieldNames),
        addFacetToFilters(facets, facetFieldNames, invertedFacets),
        addFilters(filters),
    )({ removedAt: { $exists: false } });

    if (excludeSubresources) {
        publishedDatasetFilters.subresourceId = null;
    }

    return publishedDatasetFilters;
};

export default getPublishedDatasetFilter;
