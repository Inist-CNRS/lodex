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

    request.get(options, (error, response, body) => {
        if (error) {
            /* eslint-disable */
            console.error('options:', options);
            console.error('error', error);
            console.error(
                'response',
                response && response.statusCode,
                response && response.statusMessage,
                response && response.headers,
            );
            /* eslint-enable */

            return feed.end();
        }

        if (body && body.hits && body.hits.length === 0) {
            return feed.end();
        }

        feed.write(body);

        if (body.noMoreScrollResults) {
            return feed.close();
        }
        return scrollRecursive(feed);
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
    json = this.getParam('json', true);
    const query = url.parse(data);

    const urlObj = {
        protocol: 'https:',
    /** Remove when api turn to v5 */
        hostname: 'api-v5.istex.fr',
        pathname: 'document',
        search: `${query.search}&scroll=30s&output=${output}&size=10&sid=${sid}`,
    };

    const options = {
        uri: url.format(urlObj),
        json,
    };

    return request.get(options, (error, reponse, body) => {
        if (error) {
            /* eslint-disable */
            console.error('options:', options);
            console.error('error', error);
            console.error(
                'response',
                reponse.statusCode,
                reponse.statusMessage,
                reponse.headers,
            );
           /* eslint-enable */
            return feed.end();
        }

        feed.write(body);

        if (body.noMoreScrollResults) {
            return feed.close();
        }

        nextURI = body.nextScrollURI;
        return scrollRecursive(feed);
    });
};
