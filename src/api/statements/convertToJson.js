module.exports = function convertToJson(data, feed) {
    // console.log('data', data); //resource
    // console.log('feed', feed); //output

    if (!data) {
        return feed.close();
    }

    // const getLabel = data.reduce(
    //     (data, field) => {
    //         data[field.name] = field.label;
    //
    //         return data;
    //     },
    //     { uri: 'uri' },
    // );
    //
    // const getLang = data.reduce(
    //     (data, field) => {
    //         data[field.name] = field.language;
    //
    //         return data;
    //     },
    //     { uri: 'uri' },
    // );

    const changedFields = Object.entries(data)
        .filter(([name]) => name !== 'uri')
        .map(([name, value]) => ({
            name,
            value,
            // label: getLabel[name],
            // language: getLang[name],
        }));

    const changedResource = {
        uri: data.uri,
        fields: changedFields,
    };

    // console.log(changedResource);
    feed.send(changedResource);

    return feed.end();
};
