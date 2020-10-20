import fetch from '../../lib/fetch';
import composeAsync from '../../../../common/lib/composeAsync';
import URL from 'url';
import { ISTEX_SITE_URL, ISTEX_API_URL } from '../../../../common/externals';

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

export const getSiteUrl = value =>
    `${ISTEX_SITE_URL}/?q=${encodeURIComponent(`host.issn="${value}"`)}`;

export const getApiUrl = value =>
    `${ISTEX_API_URL}/document/?q=${encodeURIComponent(
        `host.issn="${value}"`,
    )}`;

export const getUrl = ({ props: { resource, field }, page, perPage }) => {
    const value = resource[field.name];

    return {
        url: `${ISTEX_API_URL}/document/?q=${encodeURIComponent(
            value,
        )}&from=${page * perPage}&size=${perPage}&output=${output}`,
    };
};

export const getUrlFromISSN = ({
    props: { resource, field },
    page,
    perPage,
}) => {
    const value = resource[field.name];

    return {
        url: `${ISTEX_API_URL}/document/?q=${encodeURIComponent(
            `host.issn="${value}"`,
        )}&from=${page * perPage}&size=${perPage}&output=${output}`,
    };
};

export const parseFetchResult = fetchResult => {
    if (fetchResult.error) {
        throw new Error(fetchResult.error);
    }
    const {
        response: { total, hits, nextPageURI },
    } = fetchResult;
    const { protocol, host } = URL.parse(ISTEX_API_URL);
    return {
        hits: hits.map(hit => {
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
