import get from 'lodash.get';

import composeAsync from '../../../../common/lib/composeAsync';
import { parseFetchResult } from '../shared/fetchIstexData';
import { ISTEX_API_URL } from '../../../../common/externals';
import fetch from '../../lib/fetch';
import { yearSortDirValues } from './IstexSummaryAdmin';

export const getYearUrl = ({ resource, field, searchedField }) => {
    const value = resource[field.name];

    if (!value || !searchedField) {
        return null;
    }

    return `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${value}"`,
    )})&facet=publicationDate[perYear]&size=0&output=*`;
};

export const getFoldYearUrl = ({ issn, searchedField }) => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}"`,
    )})&facet=publicationDate[perYear]&size=0&output=*`,
});

export const getDecadeYearUrl = ({ issn, to, from, searchedField }) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:[${from} TO ${to}]`,
    )})&facet=publicationDate[*-*:1]&size=0&output=*`,
});

export const getDecadeYearData = ({ issn, to, from, searchedField, sortDir }) =>
    composeAsync(
        getDecadeYearUrl({ issn, to, from, searchedField }),
        fetch,
        parseFacetData('publicationDate', ({ keyAsString }) => keyAsString),
        data => ({
            ...data,
            hits: data.hits.sort(
                (a, b) =>
                    sortDir === yearSortDirValues[0]
                        ? b.name - a.name
                        : a.name - b.name,
            ),
        }),
    );

export const parseYearData = (formatData, sortDir = yearSortDirValues[0]) => ({
    hits: get(formatData, 'aggregations.publicationDate.buckets', [])
        .sort(
            (a, b) =>
                sortDir === yearSortDirValues[0]
                    ? b.keyAsString - a.keyAsString
                    : a.keyAsString - b.keyAsString,
        )
        .map(({ keyAsString, docCount }) => ({
            name: keyAsString,
            count: docCount,
        })),
});

export const getVolumeUrl = ({ issn, year, searchedField }) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${year}"`,
    )})&facet=host.volume[*-*:1]&size=0&output=*`,
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

export const getOtherVolumeUrl = ({ issn, year, searchedField }) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${year}" AND -host.volume:[0 TO *]`,
    )})&size=0&output=*`,
});

export const parseOtherData = ({ response, error }) => {
    if (error) {
        throw error;
    }

    return {
        name: 'other',
        count: response.total,
    };
};

export const getOtherVolumeData = ({ issn, year, searchedField }) =>
    composeAsync(
        getOtherVolumeUrl({ issn, year, searchedField }),
        fetch,
        parseOtherData,
    );

export const addOtherVolumeData = ({ issn, year, searchedField }) => async ({
    hits,
}) => ({
    hits: [...hits, await getOtherVolumeData({ issn, year, searchedField })()],
});

export const getVolumeData = ({ issn, year, searchedField }) =>
    composeAsync(
        getVolumeUrl({ issn, year, searchedField }),
        fetch,
        parseVolumeData,
        addOtherVolumeData({ issn, year, searchedField }),
    );

const getVolumeQuery = volume =>
    volume === 'other' ? '-host.volume:[0 TO *]' : `host.volume:"${volume}"`;

export const getIssueUrl = ({ issn, year, volume, searchedField }) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${year}" AND ${getVolumeQuery(
            volume,
        )}`,
    )})&facet=host.issue[*-*:1]&size=0&output=*`,
});

export const parseIssueData = parseFacetData('host.issue');

export const getOtherIssueUrl = ({
    issn,
    year,
    volume,
    searchedField,
}) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${year}" AND ${getVolumeQuery(
            volume,
        )} AND -host.issue:[0 TO *]`,
    )})&size=0&output=*`,
});

export const getOtherIssueData = ({ issn, year, volume, searchedField }) =>
    composeAsync(
        getOtherIssueUrl({ issn, year, volume, searchedField }),
        fetch,
        parseOtherData,
    );

export const addOtherIssueData = ({
    issn,
    year,
    volume,
    searchedField,
}) => async ({ hits }) => ({
    hits: [
        ...hits,
        await getOtherIssueData({ issn, year, volume, searchedField })(),
    ],
});

export const getIssueData = ({ issn, year, volume, searchedField }) =>
    composeAsync(
        getIssueUrl({ issn, year, volume, searchedField }),
        fetch,
        parseIssueData,
        addOtherIssueData({ issn, year, volume, searchedField }),
    );

const getIssueQuery = issue =>
    issue === 'other' ? '-host.issue:[0 TO *]' : `host.issue:"${issue}"`;

export const getDocumentUrl = ({
    issn,
    year,
    volume,
    issue,
    searchedField,
}) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${year}" AND ${getVolumeQuery(
            volume,
        )} AND ${getIssueQuery(issue)}`,
    )})&size=10&output=id,arkIstex,title,publicationDate,author,host.genre,host.title`,
});

export const getDocumentData = ({ issn, year, volume, issue, searchedField }) =>
    composeAsync(
        getDocumentUrl({ issn, year, volume, issue, searchedField }),
        fetch,
        parseFetchResult,
    );

export const getMoreDocumentUrl = nextPageURI => ({
    url: nextPageURI,
});

export const getMoreDocumentData = nextPageURI =>
    composeAsync(getMoreDocumentUrl, fetch, parseFetchResult)(nextPageURI);
