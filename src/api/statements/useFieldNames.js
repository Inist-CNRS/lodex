module.exports = function useFieldNames(data, feed) {
    const fields = this.getParam('fields', []);

    if (this.isLast()) {
        return feed.close();
    }
    const output = fields
        .filter(field => field.cover === 'collection')
        .reduce((prev, field) => ({
            ...prev,
            [field.label || field.name]: data[field.name],
        }), {});

    return feed.send(output);
};
