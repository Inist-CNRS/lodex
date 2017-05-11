import jsonld from 'jsonld';
import url from 'url';
import validUrl from 'valid-url';

/**
 * Create a JSONLD context with prefixes and istexQuery informations in config.json
 * @return JSONLD context with properties URI
 */
function getContext(config) {
    const context = {};

    Object.keys(config.istexQuery).map((v) => {
        const propertyValue = config.istexQuery[v];

        if (validUrl.isWebUri(propertyValue)) {
            return (context[v] = propertyValue);
        }

        const istexProperty = propertyValue.split(':');

        if (!config.prefixes[istexProperty[0]]) {
            // eslint-disable-next-line
            return console.error(
            `property "${istexProperty[0]}" in istexQuery is not found in prefixes`,
            );
        }

        return (context[v] = url.resolve(
        config.prefixes[istexProperty[0]],
        istexProperty[1],
        ));
    });

    return context;
}


module.exports = function convertToExtendedNquads(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const graph = this.getParam('graph', '');
    const config = this.getParam('config', {});
    const context = this.getParam('context', getContext(config));

    const hits = data.hits;

    /* eslint-disable */
    hits.map((e) => {
        e.id = `https://api-v5.fr/document/${e.id}`;
    });
    /* eslint-enable */

    const hitsString = JSON.stringify(hits).replace(/"id":/g, '"@id":');

    const doc = {
        '@context': context,
        '@id': graph,
        '@graph': JSON.parse(hitsString),
    };

    return jsonld.toRDF(doc, { format: 'application/nquads' }, (err, nquads) => {
        if (err) {
            // eslint-disable-next-line
            console.error('toRDF: ', err);
            return feed.end();
        }
        return feed.send(nquads);
    });
};
