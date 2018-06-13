module.exports = function convertToJson(input, output) {
    // console.log('data', data); //resource
    // console.log('feed', feed); //output

    if (!input) {
        return output.close();
    }

    // const getLabel = input.reduce(
    //     (data, field) => {
    //         data[field.name] = field.label;
    //
    //         return data;
    //     },
    //     { uri: 'uri' },
    // );

    // const getLang = input.reduce(
    //     (data, field) => {
    //         data[field.name] = field.language;
    //
    //         return data;
    //     },
    //     { uri: 'uri' },
    // );

    const changedFields = Object.entries(input)
        .filter(([name]) => name !== 'uri')
        .map(([name, value]) => ({
            name,
            value,
            // label: getLabel[name],
            // language: getLang[name],
        }));

    const changedResource = {
        uri: input.uri,
        fields: changedFields,
    };

    // console.log(changedResource);
    output.send(changedResource);

    return output.end();
};
