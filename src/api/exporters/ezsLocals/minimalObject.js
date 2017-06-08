module.exports = function minimalObject(data, feed) {
    const fields = this.getParam('fields', {});
    const titleScheme = this.getParam('titleScheme', 'http://purl.org/dc/terms/title');

    if (this.isLast()) {
        feed.close();
        return;
    }
    const collectionFields = fields.filter(field => field.cover === 'collection');
    const titleField =
        collectionFields.find(({ scheme }) => scheme === titleScheme) ||
        collectionFields.find(({ label }) => label.match(/^title$/));

    let title;
    if (titleField && titleField.name && data[titleField.name]) {
        title = data[titleField.name];
    } else if (collectionFields[0] && collectionFields[0].name && data[collectionFields[0].name]) {
        title = data[collectionFields[0].name];
    } else {
        title = 'n/a';
    }
    feed.send({
        _id: data.uri,
        value: title,
    });
};
