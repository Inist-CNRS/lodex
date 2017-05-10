import jsonld from 'jsonld';

module.exports = function convertToExtendedNquads(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    const graph = this.getParam('graph', 'http://json-ld.org/playground/graph');
    const hits = data.hits;

    /**
     * Transform "id" to "@id"
     */
    /* eslint-disable */
    hits.map((e) => {
        if ('doi' in e) {
            e.doi = e.doi[0];
        }
        e.id = `https://api-v5.fr/document/${e.id}`;
    });
    /* eslint-enable */

    const hitsString = JSON.stringify(hits).replace(/"id":/g, '"@id":');

    const context = {
        doi: 'http://purl.org/ontology/bibo/doi',
     // language: "http://purl.org/ontology/dc/language",
        schema: 'http://schema.org/',
    };

    const doc = {
        '@context': context,
        '@id': graph,
        '@graph': JSON.parse(hitsString),
    };

    return jsonld.toRDF(doc, { format: 'application/nquads' }, (err, nquads) => {
        if (err) {
            console.error('toRDF: ', err);
            return feed.end();
        }
        return feed.send(nquads);
    });
};
