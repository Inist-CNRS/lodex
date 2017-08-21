
module.exports = function linkDataset(data, feed) {
    const uri = this.getParam('uri');
    const scheme = this.getParam('scheme', 'http://purl.org/dc/terms/isPartOf');

    if (uri && data && data['@context']) {
        feed.send({
            ...data,
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
