import getFieldContext from './getFieldContext';
import transformCompleteFields from './transformCompleteFields';
import formatData from './formatData';
import getUri from './getUri';

export default async function mergeCompleteField(output, field, fields, data) {
    const { name, complete, completed } = await transformCompleteFields(field);
    const completedField = fields.find(f => f.name === completed);
    const completeField = fields.find(f => f.name === complete);

    const fieldContext = getFieldContext(field, completedField.scheme);
    const completedFieldContext = getFieldContext(
        completedField,
        'http://www.w3.org/2000/01/rdf-schema#label',
    );
    const completeFieldContext = getFieldContext(field, completeField.scheme);

    return {
        ...output,
        [name]: {
            '@id': `${getUri(data.uri)}#complete/${name}`,
            [complete]: formatData(data, complete),
            [completed]: formatData(data, completed),
        },
        '@context': {
            ...output['@context'],
            [name]: fieldContext,
            [complete]: completeFieldContext,
            [completed]: completedFieldContext,
        },
    };
}
