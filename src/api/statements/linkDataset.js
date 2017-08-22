
module.exports = function linkDataset(data, feed) {
    const uri = this.getParam('uri');
    const scheme = this.getParam('scheme', 'http://purl.org/dc/terms/isPartOf');
    const datasetClass = this.getParam('datasetClass', '');

    if (uri && data && data['@context']) {
        feed.send({
            ...data,
            '@context': {
                ...data['@context'],
                dataset: {
                    '@id': scheme,
                },
            },
            dataset: {
                '@id': uri,
                '@type': datasetClass },
        });

        return;
    }

    feed.send(data);
};
