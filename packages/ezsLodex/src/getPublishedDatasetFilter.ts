import compose from 'lodash/flowRight.js';

export const addMatchToFilters = (match: any, searchableFieldNames: any) => (filters: any) => {
    if (!match || !searchableFieldNames || !searchableFieldNames.length) {
        return filters;
    }

    return {
        ...filters,
        $text: { $search: match },
    };
};

export const addRegexToFilters = (match: any, searchableFieldNames: any) => (filters: any) => {
    if (!match || !searchableFieldNames || !searchableFieldNames.length) {
        return filters;
    }

    const regexMatch = new RegExp(match);

    return {
        ...filters,
        $or: searchableFieldNames.map((name: any) => ({
            [`versions.${name}`]: { $regex: regexMatch, $options: 'i' }
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
        $or: matchableFieldNames.map((fieldName) => ({
            [`versions.${fieldName}`]: matchableFields[fieldName],
        })),
    };
};

export const getValueQueryFragment = (name: any, value: any, inverted: any) => {
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
                        // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                        invertedFacets.indexOf(name) !== -1,
                    ),
                ];
            }, []),
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
    regexSearch = false
}: any) => {
    const addSearchFilters = regexSearch
        ? addRegexToFilters
        : addMatchToFilters;

    return compose(
        addKeyToFilters('uri', uri),
        addFieldsToFilters(matchableFields),
        addSearchFilters(match, searchableFieldNames),
        addFacetToFilters(facets, facetFieldNames, invertedFacets),
    )({ removedAt: { $exists: false }, subresourceId: null });
};

export default getPublishedDatasetFilter;
