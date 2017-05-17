import validUrl from 'valid-url';

module.exports = function extractIstexQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const fields = this.getParam('fields', {});
    const config = this.getParam('config', {});

    const labels = config.istexQuery.labels.split(',');

    return fields
    .filter(field => field.format
         && field.format.name === 'istex')
    .forEach((field) => {
        const propertyName = field.name;

        if (!labels.includes(field.label) &&
            !(labels.length === 1 && labels[0] === '')) {
            return null;
        }

        if (validUrl.isUri(data[propertyName])) {
            return feed.send({
                lodex: {
                    uri: data.uri,
                },
                content: data[propertyName],
            });
        }

        /* the hostname will be replace in scroll */
        return feed.send({
            lodex: {
                uri: data.uri,
            },
            content: `http://replace-api.fr/document/?q=${data[propertyName]}`,
        });
    });
};
