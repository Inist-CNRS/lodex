import get from 'lodash.get';

import composeAsync from '../../../../common/lib/composeAsync';
import { parseFetchResult } from '../shared/fetchIstexData';
import { ISTEX_API_URL } from '../../../../common/externals';
import fetch from '../../lib/fetch';

export const getDecadeUrl = ({ issn, searchedField }) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}"`,
    )})&facet=publicationDate[*-*:10]&size=0&output=*`,
});

export const getDecadeData = ({ issn, searchedField }) =>
    composeAsync(
        getDecadeUrl({ issn, searchedField }),
        fetch,
        parseFacetData('publicationDate', ({ rangeAsString }) => {
            const [from, to] = rangeAsString.replace(/\[|\]/g, '').split('-');

            return { from, to: to - 1 };
        }),
    );

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

export const getDecadeYearData = ({ issn, to, from, searchedField }) =>
    composeAsync(
        getDecadeYearUrl({ issn, to, from, searchedField }),
        fetch,
        parseFacetData('publicationDate', ({ keyAsString }) => keyAsString),
    );

export const parseYearData = formatData =>
    get(formatData, 'aggregations.publicationDate.buckets', [])
        .sort((a, b) => a.keyAsString - b.keyAsString)
        .map(({ keyAsString, docCount }) => ({
            name: keyAsString,
            count: docCount,
        }));

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

export const getVolumeData = ({ issn, year, searchedField }) =>
    composeAsync(
        getVolumeUrl({ issn, year, searchedField }),
        fetch,
        parseVolumeData,
    );

export const getIssueUrl = ({ issn, year, volume, searchedField }) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${
            year
        }" AND host.volume:"${volume}"`,
    )})&facet=host.issue[*-*:1]&size=0&output=*`,
});

export const parseIssueData = parseFacetData('host.issue');

export const getIssueData = ({ issn, year, volume, searchedField }) =>
    composeAsync(
        getIssueUrl({ issn, year, volume, searchedField }),
        fetch,
        parseIssueData,
    );

export const getDocumentUrl = ({
    issn,
    year,
    volume,
    issue,
    searchedField,
}) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${
            year
        }" AND host.volume:"${volume}" AND host.issue:"${issue}"`,
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
