import mergeCompleteField from './mergeCompleteField';
import mergeSimpleField from './mergeSimpleField';
import mergeClasses from './mergeClasses';
import mergeCompose from './mergeCompose';
import getUri from './getUri';

const merge = async (field, fields, currentOutput, data) => {
    const propertyName = field.name;
    const isCompletedByAnotherField = fields.some(
        f => f.completes === field.name,
    );
    const isComposedOfByAnotherField = fields.some(
        f => f.composedOf && f.composedOf.fields.includes(propertyName),
    );
    const isComposedOf = Boolean(field.composedOf);
    const haveClasses = Boolean(field.classes) && Boolean(field.classes.length);
    const completesAnotherField = field.completes;

    if (isComposedOf) {
        return mergeCompose(currentOutput, field, data, fields, haveClasses);
    }

    if (haveClasses) {
        return mergeClasses(currentOutput, field, data);
    }

    if (completesAnotherField) {
        return await mergeCompleteField(currentOutput, field, fields, data);
    }

    if (
        field.scheme &&
        data[propertyName] &&
        !isCompletedByAnotherField &&
        !isComposedOfByAnotherField
    ) {
        return mergeSimpleField(currentOutput, field, data);
    }

    return currentOutput;
};

export default async function JSONLDObject(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const fields = this.getParam('fields', []);
    const collectionClass = this.getParam('collectionClass', '');
    const characteristics = this.getParam('characteristics', {});
    const exportDataset = this.getParam('exportDataset', false) === 'true';
    const output = await fields.filter(f => f.cover === 'collection').reduce(
        async (previousPromise, field) => {
            const currentOutput = await previousPromise;
            if (collectionClass) currentOutput['@type'] = collectionClass;
            return await merge(field, fields, currentOutput, data);
        },
        Promise.resolve({
            '@id': getUri(data.uri),
        })
    );

    if (this.isFirst() && exportDataset) {
        // https://gyandeeps.com/array-reduce-async-await/ TODO: write a test
        output.dataset = await fields
            .filter(f => f.cover === 'dataset')
            .reduce(async (previousPromise, field) => {
                const currentOutput = await previousPromise;
                return await merge(
                    field,
                    fields,
                    currentOutput,
                    characteristics[0],
                );
            }, Promise.resolve({}));
    }
    feed.send(output);
}
