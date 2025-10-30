import fetch from '../../lib/fetch';
import { composeAsync, ISTEX_SITE_URL } from '@lodex/common';
import { ISTEX_API_URL } from '../../api/externals';
import URL from 'url';

export const output = [
    'id',
    'arkIstex',
    'title',
    'publicationDate',
    'author',
    'host.genre',
    'host.title',
    'host.pages.first',
    'host.pages.last',
    'host.volume',
    'host.issue',
].join(',');

// @ts-expect-error TS7006
export const getSiteUrl = (value) =>
    `${ISTEX_SITE_URL}/?q=${encodeURIComponent(`host.issn="${value}"`)}`;

// @ts-expect-error TS7006
export const getApiUrl = (value) =>
    `${ISTEX_API_URL}/document/?q=${encodeURIComponent(
        `host.issn="${value}"`,
    )}`;

// @ts-expect-error TS7031
export const getUrl = ({ props: { resource, field }, page, perPage }) => {
    const value = resource[field.name];

    return {
        url: `${ISTEX_API_URL}/document/?q=${encodeURIComponent(
            value,
        )}&from=${page * perPage}&size=${perPage}&output=${output}`,
    };
};

export const getUrlFromISSN = ({
    // @ts-expect-error TS7031
    props: { resource, field },
    // @ts-expect-error TS7031
    page,
    // @ts-expect-error TS7031
    perPage,
}) => {
    const value = resource[field.name];

    return {
        url: `${ISTEX_API_URL}/document/?q=${encodeURIComponent(
            `host.issn="${value}"`,
        )}&from=${page * perPage}&size=${perPage}&output=${output}`,
    };
};

// @ts-expect-error TS7006
export const parseFetchResult = (fetchResult) => {
    if (fetchResult.error) {
        throw new Error(fetchResult.error);
    }
    const {
        response: { total, hits, nextPageURI },
    } = fetchResult;
    const { protocol, host } = URL.parse(ISTEX_API_URL);
    return {
        // @ts-expect-error TS7006
        hits: hits.map((hit) => {
            const hostPagesFirst =
                hit.host.pages && hit.host.pages.first
                    ? hit.host.pages.first
                    : '';
            const hostPagesLast =
                hit.host.pages && hit.host.pages.first
                    ? hit.host.pages.last
                    : '';
            const hostVolume = hit.host.volume ? hit.host.volume : '';
            const hostIssue = hit.host.issue ? hit.host.issue : '';

            return {
                id: hit.id,
                url: URL.format({
                    protocol,
                    host,
                    pathname: `${hit.arkIstex}/fulltext.pdf`,
                }),
                title: hit.title,
                publicationDate: hit.publicationDate,
                // @ts-expect-error TS7031
                authors: hit.author ? hit.author.map(({ name }) => name) : '',
                hostGenre: hit.host.genre[0],
                hostTitle: hit.host.title,
                hostPagesFirst,
                hostPagesLast,
                hostVolume,
                hostIssue,
            };
        }),
        total,
        nextPageURI,
    };
};

export const fetchForIstexFormat = composeAsync(
    getUrl,
    fetch,
    parseFetchResult,
);
export const fetchForIstexSummaryFormat = composeAsync(
    getUrlFromISSN,
    fetch,
    parseFetchResult,
);
export const fetchIstexHierarchy = composeAsync(fetch, parseFetchResult);
