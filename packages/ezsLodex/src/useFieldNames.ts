export default function useFieldNames(this: any, data: any, feed: any) {
    const fields = this.getParam('fields', []);

    if (this.isLast()) {
        return feed.close();
    }
    const output = fields
        .filter((field: any) => field.cover === 'collection')
        .reduce(
            // @ts-expect-error TS(7006): Parameter 'prev' implicitly has an 'any' type.
            (prev, field) => ({
                ...prev,
                [field.label || field.name]: data[field.name],
            }),
            {},
        );

    return feed.send(output);
}
