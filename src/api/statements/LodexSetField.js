export default function LodexSetField(data, feed) {
    const target = this.getParam('target', '$field');
    const fromScheme = this.getParam('fromScheme');
    const schemes = Array.isArray(fromScheme) ? fromScheme : [fromScheme];

    if (this.isLast()) {
        feed.close();
        return;
    }
    if (!fromScheme) {
        throw new Error('fromScheme= must be defined as parameter.');
    }
    if (!data.$context) {
        throw new Error(
            '[LodexContext] should be definied before this statement.',
        );
    }

    const collectionFields = data.$context.fields.filter(
        field => field.cover === 'collection',
    );

    const selectedField = schemes
        .map(localScheme =>
            collectionFields.find(({ scheme }) => scheme === localScheme),
        )
        .filter(item => item)
        .shift();

    if (!selectedField) {
        throw new Error('Unknown scheme in the model.');
    }
    data[target] = selectedField.name;
    feed.send(data);
}
