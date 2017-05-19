import jsonld from 'jsonld';
import url from 'url';
import validUrl from 'valid-url';

/**
 * Create a JSONLD context with prefixes and istexQuery informations in config.json
 * @return JSONLD context with properties URI
 */
function getContext(config) {
    const context = {};

    Object.keys(config.istexQuery.context).map((v) => {
        const propertyValue = config.istexQuery.context[v];

        if (validUrl.isWebUri(propertyValue)) {
            return (context[v] = propertyValue);
        }

        const istexProperty = propertyValue
        .split(':')
        .map(e => e.trim());

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


module.exports = function convertToExtendedNquads(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const config = this.getParam('config', {});
    const graph = config.istexQuery.graph || this.getParam('graph', '');
    const context = this.getParam('context', getContext(config));

    const hits = data.content.hits;

    hits.forEach((e) => {
        e['@id'] = `https://api.istex.fr/document/${e.id}`;
        e['@type'] = 'http://purl.org/ontology/bibo/Document';
        e[config.istexQuery.linked] = data.uri;
        delete e.id;
    });

    const doc = {
        '@context': context,
        '@id': graph,
        '@graph': hits,
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
