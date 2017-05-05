export default function useFieldNames(data, feed) {
    const fields = this.getParam('fields', {});

    if (this.isLast()) {
        feed.close();
        return;
    }
    const output = fields.filter(field => field.cover === 'collection').map((currentOutput, field) => ({
        ...currentOutput,
        [field.label || field.name]: data[field.name],
    }), {});

    feed.send(output);
}
