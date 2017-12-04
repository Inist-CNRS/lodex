import jsonld from 'jsonld';

module.exports = function convertJsonLdToNQuads(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    jsonld.toRDF(
        data,
        {
            format: 'application/nquads',
        },
        (err, nquads) => {
            if (err) {
                // eslint-disable-next-line
                console.error('toRDF: ', err);
                return feed.end();
            }
            return feed.send(nquads);
        },
    );
    return;
};
