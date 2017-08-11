import getFieldContext from './getFieldContext';
import getUri from './getUri';

export default function mergeCompose(output, field, data, composedFields, fields) {
    const propertyName = field.name;
    const composeFields = field.composedOf.fields;
    const fieldContext = getFieldContext(field);
    const composeFieldsContext = fields
    .filter(e => composeFields.includes(e.name))
    .reduce((a, e) => {
        if (!e.scheme) {
            return a;
        }

        return { ...a, [e.name]: getFieldContext(e) };
    }, {});

    const result = {
        ...output,
        [propertyName]: composeFields.map((e) => {
            composedFields.push(e);
            if (fields.find(f => f.name === e).scheme) {
                return {
                    '@id': `${getUri(data.uri)}/compose/${e}`,
                    [e]: data[e] };
            }
            return null;
        }),
        '@context': {
            ...output['@context'],
            ...composeFieldsContext,
            [propertyName]: fieldContext,
        },
    };

    return result;
}
