import get from 'lodash.get';
import omit from 'lodash.omit';

import composeAsync from '../../../../common/lib/composeAsync';
import { parseFetchResult } from '../shared/fetchIstexData';
import { ISTEX_API_URL } from '../../../../common/externals';
import fetch from '../../lib/fetch';
import { CUSTOM_ISTEX_QUERY, SORT_YEAR_DESC } from './constants';

const defaultQueryOptions = {
    query: '',
    facet: null,
    output: '*',
    size: 0,
};

const buildIstexQuery = (options = defaultQueryOptions) => {
    const opts = { ...defaultQueryOptions, ...options };
    const params = {
        ...omit(opts, ['query']),
        q: `(${opts.query})`,
    };

    const queryParams = Object.entries(params)
        .filter(param => Number.isInteger(param[1]) || !!param[1])
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join('&');

    return `${ISTEX_API_URL}/document/?${queryParams}`;
};

const getFilterQuery = (searchedField, value) =>
    searchedField === CUSTOM_ISTEX_QUERY
        ? `(${value})`
        : `${searchedField}:"${value}"`;

export const getYearUrl = ({ resource, field, searchedField }) => {
    const value = resource[field.name];

    if (!value || !searchedField) {
        return null;
    }

    return buildIstexQuery({
        query: getFilterQuery(searchedField, value),
        facet: 'publicationDate[perYear]',
    });
};

export const getDecadeYearUrl = ({ value, to, from, searchedField }) => () => ({
    url: buildIstexQuery({
        query: `${getFilterQuery(
            searchedField,
            value,
        )} AND publicationDate:[${from} TO ${to}]`,
        facet: 'publicationDate[*-*:1]',
    }),
});

export const getDecadeYearData = ({
    value,
    to,
    from,
    searchedField,
    sortDir,
}) =>
    composeAsync(
        getDecadeYearUrl({ value, to, from, searchedField }),
        fetch,
        parseFacetData('publicationDate', ({ keyAsString }) => keyAsString),
        data => ({
            ...data,
            hits: data.hits.sort((a, b) =>
                sortDir === SORT_YEAR_DESC ? b.name - a.name : a.name - b.name,
            ),
        }),
    );

export const parseYearData = (formatData, sortDir = SORT_YEAR_DESC) => ({
    hits: get(formatData, 'aggregations.publicationDate.buckets', [])
        .sort((a, b) =>
            sortDir === SORT_YEAR_DESC
                ? b.keyAsString - a.keyAsString
                : a.keyAsString - b.keyAsString,
        )
        .map(({ keyAsString, docCount }) => ({
            name: keyAsString,
            count: docCount,
        })),
});

export const getVolumeUrl = ({ value, year, searchedField }) => () => ({
    url: buildIstexQuery({
        query: `${getFilterQuery(
            searchedField,
            value,
        )} AND publicationDate:"${year}"`,
        facet: 'host.volume[*-*:1]',
    }),
});

export const parseFacetData = (facetName, getName = ({ key }) => key) => ({
    response,
    error,
}) => {
    if (error) {
        throw error;
    }

    return {
        hits: get(response, ['aggregations', facetName, 'buckets'], []).map(
            ({ docCount, ...data }) => ({
                name: getName(data),
                count: docCount,
            }),
        ),
    };
};

export const parseVolumeData = parseFacetData('host.volume');

export const getOtherVolumeUrl = ({ value, year, searchedField }) => () => ({
    url: buildIstexQuery({
        query: `${getFilterQuery(
            searchedField,
            value,
        )} AND publicationDate:"${year}" AND -host.volume:[0 TO *]`,
        output: 'host.volume',
        size: '*',
    }),
});

export const parseOtherData = key => ({ response, error }) => {
    if (error) {
        throw error;
    }
    const count = response.hits.reduce((acc, hit) => {
        const name = get(hit, key, 'other');
        return {
            ...acc,
            [name]: get(acc, name, 0) + 1,
        };
    }, {});

    return Object.keys(count).map(name => ({ name, count: count[name] }));
};

export const getOtherVolumeData = ({ value, year, searchedField }) =>
    composeAsync(
        getOtherVolumeUrl({ value, year, searchedField }),
        fetch,
        parseOtherData('host.volume'),
    );

export const addOtherVolumeData = ({ value, year, searchedField }) => async ({
    hits,
}) => ({
    hits: [
        ...hits,
        ...(await getOtherVolumeData({ value, year, searchedField })()),
    ],
});

export const getVolumeData = ({ value, year, searchedField }) =>
    composeAsync(
        getVolumeUrl({ value, year, searchedField }),
        fetch,
        parseVolumeData,
        addOtherVolumeData({ value, year, searchedField }),
    );

const getVolumeQuery = volume =>
    volume === 'other' ? '-host.volume.raw:*' : `host.volume.raw:"${volume}"`;

export const getIssueUrl = ({ value, year, volume, searchedField }) => () => ({
    url: buildIstexQuery({
        query: `${getFilterQuery(
            searchedField,
            value,
        )} AND publicationDate:"${year}" AND ${getVolumeQuery(volume)}`,
        facet: 'host.issue[*-*:1]',
    }),
});

export const parseIssueData = parseFacetData('host.issue');

export const getOtherIssueUrl = ({
    value,
    year,
    volume,
    searchedField,
}) => () => ({
    url: buildIstexQuery({
        query: `${getFilterQuery(
            searchedField,
            value,
        )} AND publicationDate:"${year}" AND ${getVolumeQuery(
            volume,
        )} AND -host.issue:[0 TO *]`,
        size: '*',
        output: 'host.issue',
    }),
});

export const getOtherIssueData = ({ value, year, volume, searchedField }) =>
    composeAsync(
        getOtherIssueUrl({ value, year, volume, searchedField }),
        fetch,
        parseOtherData('host.issue'),
    );

export const addOtherIssueData = ({
    value,
    year,
    volume,
    searchedField,
}) => async ({ hits }) => ({
    hits: [
        ...hits,
        ...(await getOtherIssueData({ value, year, volume, searchedField })()),
    ].sort((a, b) => (a.name < b.name ? -1 : 1)),
});

export const getIssueData = ({ value, year, volume, searchedField }) =>
    composeAsync(
        getIssueUrl({ value, year, volume, searchedField }),
        fetch,
        parseIssueData,
        addOtherIssueData({ value, year, volume, searchedField }),
    );

const getIssueQuery = issue =>
    issue === 'other' ? '-host.issue.raw:*' : `host.issue.raw:"${issue}"`;

const documentOutput = [
    'id',
    'arkIstex',
    'title',
    'publicationDate',
    'author',
    'host.genre',
    'host.title',
];

export const getDocumentUrl = ({
    value,
    year,
    volume,
    issue,
    searchedField,
    documentSortBy,
}) => () => ({
    url: buildIstexQuery({
        query: `${getFilterQuery(
            searchedField,
            value,
        )} AND publicationDate:"${year}" AND ${getVolumeQuery(
            volume,
        )} AND ${getIssueQuery(issue)}`,
        output: documentOutput.join(','),
        sortBy: documentSortBy,
        size: 10,
    }),
});

export const getDocumentData = ({
    value,
    year,
    volume,
    issue,
    searchedField,
    documentSortBy,
}) =>
    composeAsync(
        getDocumentUrl({
            value,
            year,
            volume,
            issue,
            searchedField,
            documentSortBy,
        }),
        fetch,
        parseFetchResult,
    );

export const getMoreDocumentUrl = nextPageURI => ({
    url: nextPageURI,
});

export const getMoreDocumentData = nextPageURI =>
    composeAsync(getMoreDocumentUrl, fetch, parseFetchResult)(nextPageURI);
