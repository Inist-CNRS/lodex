import request from 'request';
import url from 'url';

let json;
let nextURI;

/**
 * Get the nextURI in the API and call himself until body have noMoreScrollResults : true
 *
 */
function scrollRecursive(feed) {
    const options = {
        uri: nextURI,
        method: 'GET',
        json,
    };

    request(options, (error, response, body) => {
        if (!error) {
            /* eslint-disable */
            console.error('options:', options);
            console.error('error', error);
            console.error('response',
                         response.statusCode,
                         response.statusMessage,
                         response.headers);
            /* eslint-enable */
            return feed.end();
        }

        feed.write(body);

        if (!body.noMoreScrollResults) {
            return scrollRecursive(feed);
        }

        return feed.end();
    });
}


/**
 * scroll use the scrolling features of API istex
 * data: url
 */
module.exports = function scroll(data, feed) {
    const output = this.getParam('output', 'doi');
    const sid = this.getParam('sid', 'lodex');
    json = this.getParam('json', true);
    const query = url.parse(data);

    const urlObj = {
        protocol: 'https:',
    /** Remove when api turn to v5 */
        hostname: 'api-v5.istex.fr',
        pathname: 'document',
        search: `${query.search}&scroll=30s&output=${output}&sid=${sid}`,
    };

    const options = {
        uri: url.format(urlObj),
        method: 'GET',
        json,
    };

    request(options, (error, response, body) => {
        if (!error) {
            /* eslint-disable */
            console.error('options:', options);
            console.error('error', error);
            console.error('response',
                         response.statusCode,
                         response.statusMessage,
                         response.headers);
            /* eslint-enable */
            return feed.end();
        }

        feed.write(body);

        if (!body.noMoreScrollResults) {
            nextURI = body.nextScrollURI;
            return scrollRecursive(feed);
        }

        return feed.end();
    });
};
