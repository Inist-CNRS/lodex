module.exports = function minimalObject(data, feed) {
    const fields = this.getParam('fields', {});
    if (this.isLast()) {
        feed.close();
        return;
    }
    const collectionFields = fields.filter(field => field.cover === 'collection');
    const titleField = collectionFields.find(({ overview }) => overview === 1);

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
