import fetch from '../../lib/fetch';
import composeAsync from '../../../../common/lib/composeAsync';

const istexApiUrl = process.env.ISTEX_API_URL;

export const getUrl = ({ props: { resource, field }, page, perPage }) => {
    const value = resource[field.name];
    const output = 'id,title,publicationDate,fulltext,abstract';

    return {
        url: `${istexApiUrl}/?q=${encodeURIComponent(value)}&from=${page * perPage}&size=${perPage}&output=${output}`,
    };
};

export const parseFetchResult = (fetchResult) => {
    if (fetchResult.error) {
        throw new Error(fetchResult.error);
    }
    const { response: { total, hits } } = fetchResult;

    return {
        hits: hits.map(hit => ({
            ...hit,
            fulltext: hit.fulltext.find(({ extension }) => extension === 'pdf').uri,
        })),
        total,
    };
};

export default composeAsync(
    getUrl,
    fetch,
    parseFetchResult,
);
