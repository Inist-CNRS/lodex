import get from 'lodash/get';
import omit from 'lodash/omit';

// @ts-expect-error TS7016
import composeAsync from '../../../../../common/lib/composeAsync';
import { parseFetchResult, output } from '../../utils/fetchIstexData';
// @ts-expect-error TS7016
import { ISTEX_API_URL } from '../../../../../common/externals';
import fetch from '../../../lib/fetch';
import alphabeticalSort from '../../../lib/alphabeticalSort';
import { CUSTOM_ISTEX_QUERY, SORT_YEAR_DESC } from './constants';

const defaultQueryOptions = {
    query: '',
    facet: null,
    output: '*',
    size: 0,
};

export const buildIstexQuery = (options = defaultQueryOptions) => {
    const opts = { ...defaultQueryOptions, ...options };
    const params = {
        ...omit(opts, ['query']),
        q: `(${opts.query})`,
    };

    const queryParams = Object.entries(params)
        .filter((param) => Number.isInteger(param[1]) || !!param[1])
        .map(
            ([key, value]) =>
                // @ts-expect-error TS2345
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join('&');

    return `${ISTEX_API_URL}/document/?${queryParams}`;
};

// @ts-expect-error TS7006
export const getFilterQuery = (searchedField, value) =>
    searchedField === CUSTOM_ISTEX_QUERY
        ? `(${value})`
        : `${searchedField}:"${value}"`;

// @ts-expect-error TS7031
export const getYearUrl = ({ resource, field, searchedField }) => {
    const value = resource[field.name];

    if (!value || !searchedField) {
        return null;
    }

    return buildIstexQuery({
        query: getFilterQuery(searchedField, value),
        // @ts-expect-error TS2322
        facet: 'publicationDate[perYear]',
    });
};

export const getDecadeYearUrl =
    // @ts-expect-error TS7031


        ({ value, to, from, searchedField }) =>
        () => ({
            url: buildIstexQuery({
                query: `${getFilterQuery(
                    searchedField,
                    value,
                )} AND publicationDate:[${from} TO ${to}]`,
                // @ts-expect-error TS2322
                facet: 'publicationDate[*-*:1]',
            }),
        });

export const getDecadeYearData = ({
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    to,
    // @ts-expect-error TS7031
    from,
    // @ts-expect-error TS7031
    searchedField,
    // @ts-expect-error TS7031
    sortDir,
}) =>
    composeAsync(
        getDecadeYearUrl({ value, to, from, searchedField }),
        fetch,
        // @ts-expect-error TS2339
        parseFacetData('publicationDate', ({ keyAsString }) => keyAsString),
        // @ts-expect-error TS7006
        (data) => ({
            ...data,
            // @ts-expect-error TS7006
            hits: data.hits.sort((a, b) =>
                sortDir === SORT_YEAR_DESC ? b.name - a.name : a.name - b.name,
            ),
        }),
    );

// @ts-expect-error TS7006
export const parseYearData = (formatData, sortDir = SORT_YEAR_DESC) => ({
    hits: get(formatData, 'aggregations.publicationDate.buckets', [])
        // @ts-expect-error TS7006
        .sort((a, b) =>
            sortDir === SORT_YEAR_DESC
                ? b.keyAsString - a.keyAsString
                : a.keyAsString - b.keyAsString,
        )
        // @ts-expect-error TS7031
        .map(({ keyAsString, docCount }) => ({
            name: keyAsString,
            count: docCount,
        })),
});

export const getVolumeUrl =
    // @ts-expect-error TS7031


        ({ value, year, searchedField }) =>
        () => ({
            url: buildIstexQuery({
                query: `${getFilterQuery(
                    searchedField,
                    value,
                )} AND publicationDate:"${year}"`,
                // @ts-expect-error TS2322
                facet: 'host.volume[*-*:1]',
            }),
        });

export const parseFacetData =
    // @ts-expect-error TS7006


        (facetName, getName = ({ key }) => key) =>
        // @ts-expect-error TS7031
        ({ response, error }) => {
            if (error) {
                throw error;
            }

            return {
                hits: get(
                    response,
                    ['aggregations', facetName, 'buckets'],
                    [],
                ).map(
                    // @ts-expect-error TS7031
                    ({ docCount, ...data }) => ({
                        // @ts-expect-error TS2345
                        name: getName(data),
                        count: docCount,
                    }),
                ),
            };
        };

export const parseVolumeData = parseFacetData('host.volume');

export const getOtherVolumeUrl =
    // @ts-expect-error TS7031


        ({ value, year, searchedField }) =>
        () => ({
            url: buildIstexQuery({
                query: `${getFilterQuery(
                    searchedField,
                    value,
                )} AND publicationDate:"${year}" AND -host.volume:[0 TO *]`,
                output: 'host.volume',
                // @ts-expect-error TS2322
                size: '*',
            }),
        });

export const parseOtherData =
    // @ts-expect-error TS7006


        (key) =>
        // @ts-expect-error TS7031
        ({ response, error }) => {
            if (error) {
                throw error;
            }
            // @ts-expect-error TS7006
            const count = response.hits.reduce((acc, hit) => {
                const name = get(hit, key, 'other');
                return {
                    ...acc,
                    [name]: get(acc, name, 0) + 1,
                };
            }, {});

            return Object.keys(count).map((name) => ({
                name,
                count: count[name],
            }));
        };

// @ts-expect-error TS7031
export const getOtherVolumeData = ({ value, year, searchedField }) =>
    composeAsync(
        getOtherVolumeUrl({ value, year, searchedField }),
        fetch,
        parseOtherData('host.volume'),
    );

export const addOtherVolumeData =
    // @ts-expect-error TS7031


        ({ value, year, searchedField }) =>
        // @ts-expect-error TS7031
        async ({ hits }) => ({
            hits: alphabeticalSort([
                ...hits,
                ...(await getOtherVolumeData({ value, year, searchedField })()),
            ]),
        });

// @ts-expect-error TS7031
export const getVolumeData = ({ value, year, searchedField }) =>
    composeAsync(
        getVolumeUrl({ value, year, searchedField }),
        fetch,
        parseVolumeData,
        addOtherVolumeData({ value, year, searchedField }),
    );

// @ts-expect-error TS7006
const getVolumeQuery = (volume) =>
    volume === 'other' ? '-host.volume.raw:*' : `host.volume.raw:"${volume}"`;

export const getIssueUrl =
    // @ts-expect-error TS7031


        ({ value, year, volume, searchedField }) =>
        () => ({
            url: buildIstexQuery({
                query: `${getFilterQuery(
                    searchedField,
                    value,
                )} AND publicationDate:"${year}" AND ${getVolumeQuery(volume)}`,
                // @ts-expect-error TS2322
                facet: 'host.issue[*-*:1]',
            }),
        });

export const parseIssueData = parseFacetData('host.issue');

export const getOtherIssueUrl =
    // @ts-expect-error TS7031


        ({ value, year, volume, searchedField }) =>
        () => ({
            url: buildIstexQuery({
                query: `${getFilterQuery(
                    searchedField,
                    value,
                )} AND publicationDate:"${year}" AND ${getVolumeQuery(
                    volume,
                )} AND -host.issue:[0 TO *]`,
                // @ts-expect-error TS2322
                size: '*',
                output: 'host.issue',
            }),
        });

// @ts-expect-error TS7031
export const getOtherIssueData = ({ value, year, volume, searchedField }) =>
    composeAsync(
        getOtherIssueUrl({ value, year, volume, searchedField }),
        fetch,
        parseOtherData('host.issue'),
    );

export const addOtherIssueData =
    // @ts-expect-error TS7031


        ({ value, year, volume, searchedField }) =>
        // @ts-expect-error TS7031
        async ({ hits }) => ({
            hits: alphabeticalSort([
                ...hits,
                ...(await getOtherIssueData({
                    value,
                    year,
                    volume,
                    searchedField,
                })()),
            ]),
        });

// @ts-expect-error TS7031
export const getIssueData = ({ value, year, volume, searchedField }) =>
    composeAsync(
        getIssueUrl({ value, year, volume, searchedField }),
        fetch,
        parseIssueData,
        addOtherIssueData({ value, year, volume, searchedField }),
    );

// @ts-expect-error TS7006
const getIssueQuery = (issue) =>
    issue === 'other' ? '-host.issue.raw:*' : `host.issue.raw:"${issue}"`;

export const getDocumentUrl =
    // @ts-expect-error TS7031


        ({ value, year, volume, issue, searchedField, documentSortBy }) =>
        () => ({
            url: buildIstexQuery({
                query: `${getFilterQuery(
                    searchedField,
                    value,
                )} AND publicationDate:"${year}" AND ${getVolumeQuery(
                    volume,
                )} AND ${getIssueQuery(issue)}`,
                output,
                // @ts-expect-error TS2353
                sortBy: documentSortBy,
                size: 10,
            }),
        });

export const getDocumentData = ({
    // @ts-expect-error TS7031
    value,
    // @ts-expect-error TS7031
    year,
    // @ts-expect-error TS7031
    volume,
    // @ts-expect-error TS7031
    issue,
    // @ts-expect-error TS7031
    searchedField,
    // @ts-expect-error TS7031
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

// @ts-expect-error TS7006
export const getMoreDocumentUrl = (nextPageURI) => ({
    url: nextPageURI,
});

// @ts-expect-error TS7006
export const getMoreDocumentData = (nextPageURI) =>
    composeAsync(getMoreDocumentUrl, fetch, parseFetchResult)(nextPageURI);
