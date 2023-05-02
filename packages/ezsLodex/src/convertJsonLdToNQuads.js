import jsonld from 'jsonld';

/**
 * Take a JSON-LD object and transform it into NQuads triples.
 *
 * @name convertJsonLdToNQuads
 * @param none.
 * @returns {String}
 */
export default async function convertJsonLdToNQuads(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const nquads = await jsonld.toRDF(data, {
        format: 'application/n-quads',
    });
    feed.send(nquads);
}
