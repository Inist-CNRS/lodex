import get from 'lodash/get';
import omit from 'lodash/omit';

import { composeAsync } from '@lodex/common';
import { ISTEX_API_URL } from '../../api/externals';
import { parseFetchResult, output } from '../../utils/fetchIstexData';
import fetch from '@lodex/frontend-common/fetch/fetch';
import alphabeticalSort from '@lodex/frontend-common/utils/alphabeticalSort';
import { CUSTOM_ISTEX_QUERY, SORT_YEAR_DESC, type SortYear } from './constants';

const defaultQueryOptions = {
    query: '',
    facet: null,
    output: '*',
    size: 0,
};

export const buildIstexQuery = (
    options: {
        query: string;
        facet?: string | null;
        output?: string;
        size?: number | string;
        sortBy?: string;
    } = defaultQueryOptions,
) => {
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

export const getFilterQuery = (searchedField: string, value: unknown) =>
    searchedField === CUSTOM_ISTEX_QUERY
        ? `(${value})`
        : `${searchedField}:"${value}"`;

export const getYearUrl = ({
    resource,
    field,
    searchedField,
}: {
    resource: Record<string, unknown>;
    field: { name: string };
    searchedField: string;
}) => {
    const value = resource[field.name];

    if (!value || !searchedField) {
        return null;
    }

    return buildIstexQuery({
        query: getFilterQuery(searchedField, value),
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
                facet: 'publicationDate[*-*:1]',
            }),
        });

export const getDecadeYearData = ({
    value,
    to,
    from,
    searchedField,
    sortDir,
}: {
    value: string;
    to: string;
    from: string;
    searchedField: string;
    sortDir: SortYear;
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

export const parseYearData = (
    formatData: object,
    sortDir: SortYear = SORT_YEAR_DESC,
) => ({
    hits: get(formatData, 'aggregations.publicationDate.buckets', [])
        .sort(
            (
                a: {
                    keyAsString: number;
                },
                b: {
                    keyAsString: number;
                },
            ) =>
                sortDir === SORT_YEAR_DESC
                    ? b.keyAsString - a.keyAsString
                    : a.keyAsString - b.keyAsString,
        )
        .map(
            ({
                keyAsString,
                docCount,
            }: {
                keyAsString: string;
                docCount: number;
            }) => ({
                name: keyAsString,
                count: docCount,
            }),
        ),
});

export const getVolumeUrl =
    ({
        value,
        year,
        searchedField,
    }: {
        value: string;
        year: string;
        searchedField: string;
    }) =>
    () => ({
        url: buildIstexQuery({
            query: `${getFilterQuery(
                searchedField,
                value,
            )} AND publicationDate:"${year}"`,
            facet: 'host.volume[*-*:1]',
        }),
    });

export const parseFacetData =
    (
        facetName: string,
        getName: ({ key }: { key: string }) => string = ({ key }) => key,
    ) =>
    ({ response, error }: { response: unknown; error: Error | null }) => {
        if (error) {
            throw error;
        }

        return {
            hits: get(response, ['aggregations', facetName, 'buckets'], []).map(
                ({ docCount, ...data }: { key: string; docCount: number }) => ({
                    name: getName(data),
                    count: docCount,
                }),
            ),
        };
    };

export const parseVolumeData = parseFacetData('host.volume');

export const getOtherVolumeUrl =
    ({
        value,
        year,
        searchedField,
    }: {
        value: string;
        year: string;
        searchedField: string;
    }) =>
    () => ({
        url: buildIstexQuery({
            query: `${getFilterQuery(
                searchedField,
                value,
            )} AND publicationDate:"${year}" AND -host.volume:[0 TO *]`,
            output: 'host.volume',
            size: '*',
        }),
    });

export const parseOtherData =
    (key: string) =>
    ({
        response,
        error,
    }: {
        response: { hits: Record<string, unknown>[]; total: number };
        error?: Error | null;
    }) => {
        if (error) {
            throw error;
        }
        const count = response.hits.reduce((acc, hit) => {
            const name = get(hit, key, 'other') as string;
            return {
                ...acc,
                [name]: (get(acc, name, 0) as number) + 1,
            };
        }, {});

        return Object.keys(count).map((name) => ({
            name,
            count: count[name],
        }));
    };

export const getOtherVolumeData = ({
    value,
    year,
    searchedField,
}: {
    value: string;
    year: string;
    searchedField: string;
}) =>
    composeAsync(
        getOtherVolumeUrl({ value, year, searchedField }),
        fetch,
        parseOtherData('host.volume'),
    );

export const addOtherVolumeData =
    ({
        value,
        year,
        searchedField,
    }: {
        value: string;
        year: string;
        searchedField: string;
    }) =>
    async ({ hits }: { hits: { name: string; count: number }[] }) => ({
        hits: alphabeticalSort([
            ...hits,
            ...(await getOtherVolumeData({ value, year, searchedField })()),
        ]),
    });

export const getVolumeData = ({
    value,
    year,
    searchedField,
}: {
    value: string;
    year: string;
    searchedField: string;
}) =>
    composeAsync(
        getVolumeUrl({ value, year, searchedField }),
        fetch,
        parseVolumeData,
        addOtherVolumeData({ value, year, searchedField }),
    );

const getVolumeQuery = (volume: string) =>
    volume === 'other' ? '-host.volume.raw:*' : `host.volume.raw:"${volume}"`;

export const getIssueUrl =
    ({
        value,
        year,
        volume,
        searchedField,
    }: {
        value: string;
        year: string;
        volume: string;
        searchedField: string;
    }) =>
    () => ({
        url: buildIstexQuery({
            query: `${getFilterQuery(
                searchedField,
                value,
            )} AND publicationDate:"${year}" AND ${getVolumeQuery(volume)}`,
            facet: 'host.issue[*-*:1]',
        }),
    });

export const parseIssueData = parseFacetData('host.issue');

export const getOtherIssueUrl =
    ({
        value,
        year,
        volume,
        searchedField,
    }: {
        value: string;
        year: string;
        volume: string;
        searchedField: string;
    }) =>
    () => ({
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

export const getOtherIssueData = ({
    value,
    year,
    volume,
    searchedField,
}: {
    value: string;
    year: string;
    volume: string;
    searchedField: string;
}) =>
    composeAsync(
        getOtherIssueUrl({ value, year, volume, searchedField }),
        fetch,
        parseOtherData('host.issue'),
    );

export const addOtherIssueData =
    ({
        value,
        year,
        volume,
        searchedField,
    }: {
        value: string;
        year: string;
        volume: string;
        searchedField: string;
    }) =>
    async ({ hits }: { hits: { name: string; count: number }[] }) => ({
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

export const getIssueData = ({
    value,
    year,
    volume,
    searchedField,
}: {
    value: string;
    year: string;
    volume: string;
    searchedField: string;
}) =>
    composeAsync(
        getIssueUrl({ value, year, volume, searchedField }),
        fetch,
        parseIssueData,
        addOtherIssueData({ value, year, volume, searchedField }),
    );

const getIssueQuery = (issue: string) =>
    issue === 'other' ? '-host.issue.raw:*' : `host.issue.raw:"${issue}"`;

export const getDocumentUrl =
    ({
        value,
        year,
        volume,
        issue,
        searchedField,
        documentSortBy,
    }: {
        value: string;
        year: string;
        volume: string;
        issue: string;
        searchedField: string;
        documentSortBy: string;
    }) =>
    () => ({
        url: buildIstexQuery({
            query: `${getFilterQuery(
                searchedField,
                value,
            )} AND publicationDate:"${year}" AND ${getVolumeQuery(
                volume,
            )} AND ${getIssueQuery(issue)}`,
            output,
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
}: {
    value: string;
    year: string;
    volume: string;
    issue: string;
    searchedField: string;
    documentSortBy: string;
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

export const getMoreDocumentUrl = (nextPageURI: string) => ({
    url: nextPageURI,
});

export const getMoreDocumentData = (nextPageURI: string) =>
    composeAsync(getMoreDocumentUrl, fetch, parseFetchResult)(nextPageURI);
