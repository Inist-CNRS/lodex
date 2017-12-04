import validUrl from 'valid-url';
import get from 'lodash.get';

/**
 * Create a JSONLD context with prefixes and istexQuery informations in config.json
 * @return JSONLD context with properties URI
 */
function getContext(config) {
    const context = {};

    Object.keys(config.istexQuery.context).forEach(v => {
        const propertyValue = config.istexQuery.context[v];

        if (validUrl.isWebUri(propertyValue)) {
            context[v] = propertyValue;
            return context[v];
        }

        const istexProperty = propertyValue.split(':').map(e => e.trim());

        if (!config.prefixes[istexProperty[0]]) {
            // eslint-disable-next-line
            return console.error(
                `property "${
                    istexProperty[0]
                }" in istexQuery is not found in prefixes`,
            );
        }

        context[v] = `${config.prefixes[istexProperty[0]]}${istexProperty[1]}`;
        return context[v];
    });

    if (context[config.istexQuery.linked] === undefined) {
        // eslint-disable-next-line
        return console.error('ConvertToExtendedNquads', `${config.istexQuery.linked} not found in context`);
    }

    context[config.istexQuery.linked] = {
        '@id': context[config.istexQuery.linked],
        '@type': '@id',
    };

    return context;
}

const checkWeb = data => {
    if (validUrl.isWebUri(data)) {
        return { '@id': data };
    }
    return data;
};

const formatData = data => {
    if (!Array.isArray(data)) {
        return checkWeb(data);
    }
    return data.map(e => checkWeb(e));
};

module.exports = function convertToExtendedNquads(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const config = this.getParam('config', {});

    if (!this.searchKeys) {
        this.context = getContext(config);
        this.searchKeys = Object.keys(this.context).filter(
            v =>
                !Object.keys(data.content.hits[0]).includes(v) &&
                v !== config.istexQuery.linked,
        );
    }

    const hits = data.content.hits.map(hit => {
        const newHit = {
            ...hit,
        };
        newHit['@id'] = `https://api.istex.fr/${hit.arkIstex}`;
        newHit['@type'] = 'http://purl.org/ontology/bibo/Document';
        newHit[config.istexQuery.linked] = data.uri;

        this.searchKeys.forEach(key => {
            const dataFromKey = get(hit, key);
            newHit[key] = formatData(dataFromKey);
        });
        //        delete newHit.id;
        return newHit;
    });

    const doc = {
        '@context': this.context,
        '@graph': hits,
    };

    feed.send(doc);
};
