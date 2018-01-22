import fetch from '../../lib/fetch';
import composeAsync from '../../../../common/lib/composeAsync';
import URL from 'url';

const istexApiUrl = process.env.ISTEX_API_URL;

export const getUrl = ({ props: { resource, field }, page, perPage }) => {
    const value = resource[field.name];
    const output =
        'id,arkIstex,title,publicationDate,author,host.genre,host.title';

    return {
        url: `${istexApiUrl}/?q=${encodeURIComponent(value)}&from=${page *
            perPage}&size=${perPage}&output=${output}`,
    };
};

export const parseFetchResult = fetchResult => {
    if (fetchResult.error) {
        throw new Error(fetchResult.error);
    }
    const { response: { total, hits } } = fetchResult;
    const { protocol, host } = URL.parse(istexApiUrl);
    return {
        hits: hits.map(hit => ({
            id: hit.id,
            url: URL.format({
                protocol,
                host,
                pathname: hit.arkIstex.concat('/fulltext.pdf'),
            }),
            title: hit.title,
            publicationDate: hit.publicationDate,
            authors: hit.author
                ? hit.author.map(({ name }) => name).join(';')
                : '',
            hostGenre: hit.host.genre.shift(),
            hostTitle: hit.host.title,
        })),
        total,
    };
};

export default composeAsync(getUrl, fetch, parseFetchResult);
