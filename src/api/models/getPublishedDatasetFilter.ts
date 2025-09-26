// @ts-expect-error TS(2792): Cannot find module 'lodash/flowRight'. Did you mea... Remove this comment to see the full error message
import compose from 'lodash/flowRight';

export const addMatchToFilters =
    (match: any, searchableFieldNames: any) => (filters: any) => {
        if (!match || !searchableFieldNames || !searchableFieldNames.length) {
            return filters;
        }

        return {
            ...filters,
            $text: { $search: match },
        };
    };

export const addRegexToFilters =
    (match: any, searchableFieldNames: any) => (filters: any) => {
        if (!match || !searchableFieldNames || !searchableFieldNames.length) {
            return filters;
        }

        const regexMatch = new RegExp(match);

        return {
            ...filters,
            $or: searchableFieldNames.map((name: any) => ({
                [`versions.${name}`]: { $regex: regexMatch, $options: 'i' },
            })),
        };
    };

export const addFieldsToFilters = (matchableFields: any) => (filters: any) => {
    if (!matchableFields) {
        return filters;
    }

    const matchableFieldNames = Object.keys(matchableFields);
    if (!matchableFieldNames.length) {
        return filters;
    }

    return {
        ...filters,
        $or: matchableFieldNames.map((fieldName: any) => ({
            [`versions.${fieldName}`]: matchableFields[fieldName],
        })),
    };
};

export const getValueQueryFragment = (name: any, value: any, inverted: any) => {
    if (Array.isArray(value) && value.length > 1) {
        return {
            [inverted ? '$nor' : '$or']: value.map((v: any) => ({
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
    (facets: any, facetFieldNames: any, invertedFacets = []) =>
    (filters: any) => {
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
            $and: facetFieldNames.reduce((acc: any, name: any) => {
                if (!facets[name]) return acc;

                return [
                    ...acc,
                    getValueQueryFragment(
                        name,
                        facets[name],
                        // @ts-expect-error TS(2339): Property 'indexOf' does not exist on type '{}'.
                        invertedFacets.indexOf(name) !== -1,
                    ),
                ];
            }, []),
        };
    };

export const getUriFilter = ({ resourceUris, excludedResourceUris }: any) => {
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

export const addFilters = (filters: any) => (previewFilters: any) => {
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

export const addKeyToFilters = (key: any, value: any) => (filters: any) => {
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
}: any) => {
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
