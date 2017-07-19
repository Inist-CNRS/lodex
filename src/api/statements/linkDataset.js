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
function uriSpecify(data, uri) {
    deepObject.deepMapValues(data, async (value, path) => {
        if (path.includes('@id', '@context')) {
            return;
        }
        /**
         * If value is an URL
         */
        if (validUrl.isWebUri(value)) {
            await set(data, path, { '@id': value });
            return;
        }

        /**
         * If value is an uri as ark:/ or uid:/
         */
        if (validUrl.isUri(value) && !path.includes('@id', '@context')) {
            await set(data, path, { '@id': `${uri}/${value}` });
        }
    });
    return data;
}

module.exports = function linkDataset(data, feed) {
    const uri = this.getParam('uri');
    const scheme = this.getParam('scheme', 'http://purl.org/dc/terms/isPartOf');

    if (uri && data && data['@context']) {
        feed.send({
            ...uriSpecify(blankNodeSpecify(data), uri),
            '@context': {
                ...data['@context'],
                dataset: {
                    '@id': scheme,
                },
            },
            dataset: { '@id': uri },
        });

        return;
    }

    feed.send(data);
};
