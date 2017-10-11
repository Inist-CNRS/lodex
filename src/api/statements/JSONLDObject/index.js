import mergeCompleteField from './mergeCompleteField';
import mergeSimpleField from './mergeSimpleField';
import mergeClasses from './mergeClasses';
import mergeCompose from './mergeCompose';
import getUri from './getUri';

const merge = (field, fields, currentOutput, data) => {
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
};

module.exports = async function JSONLDObject(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const fields = this.getParam('fields', {});
    const collectionClass = this.getParam('collectionClass', '');
    const characteristics = this.getParam('characteristics', {});
    const exportDataset = this.getParam('exportDataset', false) === 'true';

    const output = await fields
        .filter(f => f.cover === 'collection')
        .reduce((currentOutputPromise, field) =>
            currentOutputPromise.then((currentOutput) => {
                currentOutput['@type'] = collectionClass;
                return merge(field, fields, currentOutput, data);
            }), Promise.resolve({
            '@id': getUri(data.uri),
        }));

    if (this.isFirst() && exportDataset) {
        output.dataset = await fields
            .filter(f => f.cover === 'dataset')
            .reduce((currentOutputPromise, field) =>
                currentOutputPromise.then(currentOutput =>
                    merge(field, fields, currentOutput, characteristics[0])), Promise.resolve({}));
    }

    feed.send(output);
};
