import mergeCompleteField from './mergeCompleteField';
import mergeSimpleField from './mergeSimpleField';
import mergeClasses from './mergeClasses';
import mergeCompose from './mergeCompose';
import getUri from './getUri';
import composeAsync from '../../../common/lib/composeAsync';

const merge = (
    field,
    fields,
    data,
    collectionClass = null,
) => async currentOutput => {
    if (collectionClass) {
        currentOutput['@type'] = collectionClass;
    }
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
        return mergeCompleteField(currentOutput, field, fields, data);
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
    const output = await composeAsync(
        ...fields
            .filter(f => f.cover === 'collection')
            .map(field => merge(field, fields, data, collectionClass)),
    )({
        '@id': getUri(data.uri),
    });

    if (this.isFirst() && exportDataset) {
        output.dataset = await composeAsync(
            ...fields
                .filter(f => f.cover === 'dataset')
                .map(field => merge(field, fields, characteristics[0])),
        )({});
    }

    feed.send(await output);
}
