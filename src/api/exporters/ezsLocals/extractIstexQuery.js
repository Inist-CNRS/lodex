module.exports = function extractIstexQuery(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const fields = this.getParam('fields', {});

    return fields
    .filter(field => field.format && field.format.name === 'istex')
    .forEach((field) => {
        const propertyName = field.name;
        feed.send(data[propertyName]);
    });
};
