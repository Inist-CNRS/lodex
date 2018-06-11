module.exports = function convertToJson(data, feed) {
    const getLabel = data.reduce(
        (data, field) => {
            data[field.name] = field.label;

            return data;
        },
        { uri: 'uri' },
    );

    const getLang = data.reduce(
        (data, field) => {
            data[field.name] = field.language;

            return data;
        },
        { uri: 'uri' },
    );

    if (!data) {
        return feed.close();
    }

    const changedFields = Object.entries(data)
        .filter(([name]) => name !== 'uri')
        .map(([name, value]) => ({
            name,
            value,
            label: getLabel[name],
            language: getLang[name],
        }));
    const changedResource = {
        uri: data.uri,
        fields: changedFields,
    };
    feed.send(changedResource);

    return feed.end();
};
