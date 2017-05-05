module.exports = function extractIstexQuery(data, feed) {
    if (this.isLast()) {
        feed.close();
    }
    const fields = this.getParam('fields', {});

    fields
    .filter(field => field.format && field.format.name === 'istex')
    .forEach((field) => {
        const propertyName = field.name;

        feed.write(data[propertyName]);
    });
};
