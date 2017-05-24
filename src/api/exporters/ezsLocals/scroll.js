import request from 'request';
import url from 'url';
import config from 'config';

let json;
let nextURI;

/**
 * Get the nextURI in the API and call himself until body have noMoreScrollResults : true
 *
 */
function scrollRecursive(data, feed) {
    const options = {
        uri: nextURI,
        method: 'GET',
        json,
    };

    request.get(options, (error, response, body) => {
        if (error || ![200, 502, 500, 504].includes(response.statusCode)) {
            /* eslint-disable */
            console.error('options:', options);
            console.error('error', error);
            console.error(
                'response',
                response.statusCode,
                response.statusMessage,
                response.headers,
            );
           /* eslint-enable */
            return feed.end();
        }

        if ([502, 500, 503, 504].includes(response.statusCode)) {
            /* eslint-disable */
            console.error('options:', options);
            console.error('error', error);
            console.error(
                'response',
                response.statusCode,
                response.statusMessage,
                response.headers,
            );
           /* eslint-enable */
            return setTimeout(scrollRecursive, 500, data, feed);
        }

        if (body && body.hits && body.hits.length === 0) {
            return feed.end();
        }

        feed.write({
            ...data.lodex,
            content: body,
        });

        if (body.noMoreScrollResults) {
            return feed.end();
        }
        return scrollRecursive(data, feed);
    });
}


/**
 * scroll use the scrolling features of API istex
 * data: url
 */
module.exports = function scroll(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

  /**
   * Params of the API request
   */
    const output = this.getParam('output', 'doi');
    const sid = this.getParam('sid', 'lodex');
    const size = this.getParam('size', 5000);
    const query = url.parse(data.content);

    json = this.getParam('json', true);

    const urlObj = {
        protocol: 'https:',
        hostname: url.parse(config.istexApiUrl).hostname,
        pathname: 'document',
        /* change '&' to valid the query like a URI component */
        search: `${query.search.replace(/&/g, '%26')}&scroll=30s&output=${output}&size=${size}&sid=${sid}`,
    };

    const options = {
        uri: url.format(urlObj),
        json,
    };

    return request.get(options, (error, response, body) => {
        if (error || ![200, 500, 502, 503, 504].includes(response.statusCode)) {
            /* eslint-disable */
            console.error('options:', options);
            console.error('error', error);
            console.error(
                'response',
                response.statusCode,
                response.statusMessage,
                response.headers,
            );
           /* eslint-enable */
            return feed.end();
        }

        if ([502, 500, 503, 504].includes(response.statusCode)) {
            return setTimeout(scroll, 500, data, feed);
        }

        /** API result can have any nextURI */
        if (body.nextScrollURI === undefined && !body.total) {
            /* eslint-disable */
            console.error('API Result error: ', `No results to '${query.search}'`);
            /* eslint-enable */
            return feed.end();
        }

        console.log('API query: ', query.search);

        feed.write({
            ...data.lodex,
            content: body,
        });

        if (body.noMoreScrollResults) {
            return feed.end();
        }

        nextURI = body.nextScrollURI;

        if (nextURI !== undefined) {
            return scrollRecursive(data, feed);
        }

        return feed.end();
    });
};
