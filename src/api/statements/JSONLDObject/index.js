import mergeCompleteField from './mergeCompleteField';
import mergeSimpleField from './mergeSimpleField';
import mergeClasses from './mergeClasses';
import mergeCompose from './mergeCompose';
import getUri from './getUri';

module.exports = async function JSONLDObject(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const fields = this.getParam('fields', {});

    const output = await fields
    .filter(field => field.cover === 'collection')
    .reduce((currentOutputPromise, field) =>
        currentOutputPromise.then((currentOutput) => {
            const propertyName = field.name;
            const isCompletedByAnotherField = fields.some(f => f.completes === field.name);
            const isComposedOfByAnotherField = fields.some(f => f.composedOf &&
                                                                f.composedOf.fields.includes(propertyName));
            const isComposedOf = Boolean(field.composedOf);
            const haveClasses = Boolean(field.classes) && Boolean(field.classes.length);
            const completesAnotherField = field.completes;

            if (isComposedOf) {
                return Promise.resolve(mergeCompose(currentOutput, field, data, fields, haveClasses));
            }

            if (haveClasses && !isComposedOf) {
                return Promise.resolve(mergeClasses(currentOutput, field, data));
            }

            if (completesAnotherField) {
                return Promise.resolve(mergeCompleteField(currentOutput, field, fields, data));
            }

            if (field.scheme &&
                data[propertyName] &&
                !isCompletedByAnotherField &&
                !isComposedOfByAnotherField) {
                return Promise.resolve(mergeSimpleField(currentOutput, field, data));
            }

            return Promise.resolve(currentOutput);
        }), Promise.resolve({
            '@id': getUri(data.uri),
        }));

    feed.send(output);
};
