import validUrl from 'valid-url';
import { set } from 'lodash';
import deepObject from 'deep-object-map';

/**
 * replace uri blankNode with unique uri
 * @param {object} data - JSON-LD
 */
function blankNodeSpecify(data) {
    let count = 0;
    Object.keys(data).map((e) => {
        if (e !== '@context' && typeof data[e] === 'object') {
            count += 1;
            data[e] = { '@id': `${data['@id']}/${e}/${count}`, ...data[e] };
        }
        return 0;
    });
    return data;
}

/**
 * replace @value with @id in JSON-LD
 * @param {object} data - JSON-LD
 */
function uriSpecify(data) {
    deepObject.deepMapValues(data, async (value, path) => {
        if (validUrl.isWebUri(value) && !path.includes('@id', '@context')) {
            await set(data, path, { '@id': value });
        }
    });
    return data;
}

module.exports = function linkDataset(data, feed) {
    const uri = this.getParam('uri');
    const scheme = this.getParam('scheme', 'http://purl.org/dc/terms/isPartOf');

    if (uri && data && data['@context']) {
        feed.send({
            ...uriSpecify(blankNodeSpecify(data)),
            '@context': {
                ...data['@context'],
                dataset: {
                    '@id': scheme,
                },
            },
            dataset: uri,
        });

        return;
    }

    feed.send(data);
};
