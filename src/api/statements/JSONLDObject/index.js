import mergeCompleteField from './mergeCompleteField';
import mergeSimpleField from './mergeSimpleField';
import mergeCompose from './mergeCompose';
import getUri from './getUri';

module.exports = async function JSONLDObject(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const fields = this.getParam('fields', {});
    const composedFields = [];

    const output = await fields
    .filter(field => field.cover === 'collection')
    .reduce((currentOutputPromise, field) =>
        currentOutputPromise.then((currentOutput) => {
            const propertyName = field.name;
            const isCompletedByAnotherField = fields.some(f => f.completes === field.name);
            const isComposedOf = Boolean(field.composedOf);
            const completesAnotherField = field.completes;

            if (isComposedOf) {
                return Promise.resolve(mergeCompose(currentOutput, field, data, composedFields, fields));
            }

            if (composedFields.includes(propertyName)) {
                return Promise.resolve(currentOutput);
            }

            if (completesAnotherField) {
                return Promise.resolve(mergeCompleteField(currentOutput, field, fields, data));
            }

            if (field.scheme && data[propertyName] && !isCompletedByAnotherField) {
                return Promise.resolve(mergeSimpleField(currentOutput, field, data));
            }

            return Promise.resolve(currentOutput);
        }), Promise.resolve({
            '@id': getUri(data.uri),
        }));

    composedFields.forEach((e) => {
        delete output[e];
    });

    feed.send(output);
};
