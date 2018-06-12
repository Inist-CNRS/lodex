module.exports = function convertToJson(data, feed) {
    const fields = this.getParam('fields', {});
    // TODO: create the feed in this function (see exportAtom)
    const config = this.getParam('config', {});

    if (!fields) {
        return config.close();
    }

    const getLabel = fields.reduce(
        (data, field) => {
            data[field.name] = field.label;

            return data;
        },
        { uri: 'uri' },
    );

    const getLang = fields.reduce(
        (data, field) => {
            data[field.name] = field.language;

            return data;
        },
        { uri: 'uri' },
    );

    const changedFields = Object.entries(fields)
        .filter(([name]) => name !== 'uri')
        .map(([name, value]) => ({
            name,
            value,
            label: getLabel[name],
            language: getLang[name],
        }));

    const changedResource = {
        uri: fields.uri,
        fields: changedFields,
    };

    config.send(changedResource);

    return feed.end();
};
