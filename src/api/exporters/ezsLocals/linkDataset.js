function blankNodeSpecifier(data) {
    Object.keys(data).map((e) => {
        if (e !== '@context' && typeof data[e] === 'object') {
            data[e] = { '@id': `${data['@id']}/${e}/${Math.floor(new Date())}`, ...data[e] };
        }
        return 0;
    });
    return data;
}

module.exports = function linkDataset(data, feed) {
    const uri = this.getParam('uri');
    const scheme = this.getParam('scheme', 'http://purl.org/dc/terms/isPartOf');

    if (uri && data && data['@context']) {
        feed.send({
            ...blankNodeSpecifier(data),
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
