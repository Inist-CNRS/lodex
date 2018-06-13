module.exports = function convertToJson(input, output) {
    const fields = this.getParam('fields', {});

    if (!input) {
        return output.close();
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

    const changedFields = Object.entries(input)
        .filter(([name]) => name !== 'uri')
        .map(([name, value]) => ({
            name,
            value,
            label: getLabel[name],
            language: getLang[name],
        }));

    const changedResource = {
        uri: input.uri,
        fields: changedFields,
    };

    return output.send(changedResource);
};
