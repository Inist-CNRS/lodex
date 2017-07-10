module.exports = function linkDataset(data, feed) {
    const uri = this.getParam('uri');
    const scheme = this.getParam('scheme', 'http://purl.org/dc/terms/isPartOf');

    if (uri && data && data['@context']) {
        feed.send({
            ...data,
            dataset: uri,
            '@context': {
                ...data['@context'],
                dataset: {
                    '@id': scheme,
                },
            },
        });
        return;
    }

    feed.send(data);
};
