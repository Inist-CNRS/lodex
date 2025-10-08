import get from 'lodash/get';

import fetch from '../../../lib/fetch';
import composeAsync from '../../../../../common/lib/composeAsync';
import { ISTEX_API_URL } from '../../../../../common/externals';
import { output } from '../../utils/fetchIstexData';
import { buildIstexQuery } from '../istexSummary/getIstexData';
import { TOP_HITS, REFBIBS_TITLE } from '../istexSummary/constants';

let refbibsValue = '';
// @ts-expect-error TS7031
export const getUrl = ({ props: { resource, field } }) => {
    const value = resource[field.name];
    if (!value) {
        return null;
    }
    refbibsValue = value;

    return {
        url: buildIstexQuery({
            query: value,
            // @ts-expect-error TS2322
            facet: `${REFBIBS_TITLE}[50]>${TOP_HITS}[1]`,
            output,
            size: 0,
        }),
    };
};

// @ts-expect-error TS7006
const getOpenurlQuery = (article) => {
    const queryParams = ['noredirect'];

    if (article.doi) queryParams.push('rft_id=info:doi/' + article.doi);
    else if (article.pii) queryParams.push('rft_id=info:pii/' + article.pii);
    else if (article.pmid) queryParams.push('rft_id=info:pmid/' + article.pmid);
    else {
        if (article.title) queryParams.push('rft.atitle=' + article.title);
        // if (article.author[0])
        //     queryParams.push('rft.au=' + article.author[0].name);
        // if (article.publicationDate)
        //     queryParams.push('rft.date=' + article.publicationDate);
        // if (article.host.title)
        //     queryParams.push('rft.jtitle=' + article.host.title);
        if (article.host.volume) {
            const volume = Number.parseInt(article.host.volume);
            if (Number.isInteger(volume))
                queryParams.push(`rft.volume=${volume}`);
        }
        if (article.host.issue) {
            const issue = Number.parseInt(article.host.issue);
            if (Number.isInteger(issue)) queryParams.push(`rft.issue=${issue}`);
        }
        if (article.host.pages && article.host.pages.first) {
            const pageFirst = Number.parseInt(article.host.pages.first);
            if (Number.isInteger(pageFirst))
                queryParams.push(`rft.spage=${pageFirst}`);
        }
        if (article.host.pages && article.host.pages.last) {
            const pageLast = Number.parseInt(article.host.pages.last);
            if (Number.isInteger(pageLast))
                queryParams.push(`rft.epage=${pageLast}`);
        }
    }

    if (queryParams.length > 1)
        return `${ISTEX_API_URL}/document/openurl?${queryParams.join('&')}`;
};

// @ts-expect-error TS7006
const parseOpenurlFetchResult = async (fetchResult) => {
    if (
        fetchResult.error &&
        fetchResult.error.code != 404 && // Resource not found
        fetchResult.error.code != 300 // Multiple resources found
    )
        throw new Error(fetchResult.error);

    if (fetchResult.response) {
        const {
            response: { resourceUrl },
        } = fetchResult;

        if (
            resourceUrl &&
            resourceUrl.startsWith(ISTEX_API_URL) &&
            resourceUrl.endsWith('/fulltext.pdf')
        ) {
            const resource = await fetch({
                url: `${resourceUrl.replace('fulltext.pdf', 'record.json')}`,
            });
            if (resource.response) return resource.response;
        }
    }
};

// @ts-expect-error TS7006
const isArticleIstex = async (article) => {
    const url = getOpenurlQuery(article);
    if (url) {
        const openurlFetchResult = await fetch({ url });
        if (openurlFetchResult)
            return parseOpenurlFetchResult(openurlFetchResult);
    }
};

// @ts-expect-error TS7006
const parseFetchResult = (fetchResult) => {
    if (fetchResult.error) {
        throw new Error(fetchResult.error);
    }
    const {
        response: { aggregations, nextPageURI },
    } = fetchResult;
    const buckets = get(aggregations, ['refBibs.title', 'buckets'], []);
    // @ts-expect-error TS7034
    const istexArticles = [];
    // @ts-expect-error TS7034
    const fetchPromises = [];

    // @ts-expect-error TS7006
    buckets.forEach((bucket) => {
        const refbibsArticle = get(bucket, [
            'topHits',
            'hits',
            'hits',
            '0',
            '_source',
            'refBibs',
        ]).find(
            // @ts-expect-error TS7006
            (refBib) =>
                refBib.title === bucket.key &&
                refbibsValue.includes(refBib.host.title),
        );
        if (refbibsArticle) {
            fetchPromises.push(
                isArticleIstex(refbibsArticle).then((article) => {
                    if (article) istexArticles.push(article);
                }),
            );
        }
    });

    // @ts-expect-error TS7005
    return Promise.all(fetchPromises).then(() => {
        return {
            // @ts-expect-error TS7005
            hits: istexArticles.map((istexArticle) => {
                const hostPagesFirst =
                    istexArticle.host.pages && istexArticle.host.pages.first
                        ? istexArticle.host.pages.first
                        : '';
                const hostPagesLast =
                    istexArticle.host.pages && istexArticle.host.pages.first
                        ? istexArticle.host.pages.last
                        : '';
                const hostVolume = istexArticle.host.volume
                    ? istexArticle.host.volume
                    : '';
                const hostIssue = istexArticle.host.issue
                    ? istexArticle.host.issue
                    : '';

                return {
                    id: istexArticle.id,
                    url: `${ISTEX_API_URL}/${istexArticle.arkIstex}/fulltext.pdf`,
                    title: istexArticle.title,
                    publicationDate: istexArticle.publicationDate,
                    authors: istexArticle.author
                        ? // @ts-expect-error TS7031
                          istexArticle.author.map(({ name }) => name)
                        : '',
                    hostGenre: istexArticle.host.genre[0],
                    hostTitle: istexArticle.host.title,
                    hostPagesFirst,
                    hostPagesLast,
                    hostVolume,
                    hostIssue,
                };
            }),
            total: istexArticles.length,
            nextPageURI,
        };
    });
};

export const fetchForIstexRefbibsFormat = composeAsync(
    getUrl,
    fetch,
    parseFetchResult,
);
