import fetch from '../../lib/fetch';
import composeAsync from '../../lib/composeAsync';

export const getUrl = ([{ resource, field }, page, perPage]) => {
    const value = resource[field.name];
    return {
        url: `https://api.istex.fr/document/?q="${value}"&from=${page * perPage}&size=${perPage}&output=id,title,publicationDate,fulltext,abstract`,
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
