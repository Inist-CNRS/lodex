import getFieldContext from './getFieldContext';
import getUri from './getUri';
import formatData from './formatData';

export default function mergeCompose(output, field, data, fields) {
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
            const composeField = fields.find(f => f.name === e);
            if (!composeField) {
                return null;
            }
            const composeHaveClasses = Boolean(composeField.classes) && Boolean(composeField.classes.length);

            let resultData = formatData(data, e);

            if (composeHaveClasses) {
                resultData = {
                    '@id': `${getUri(data.uri)}/classes/${propertyName}/${e}`,
                    '@type': composeField.classes,
                    label: formatData(data, e),
                };
            }

            if (composeField.scheme) {
                return {
                    '@id': `${getUri(data.uri)}/compose/${propertyName}`,
                    '@type': field.classes || [],
                    [e]: resultData };
            }

            return null;
        }),
        '@context': {
            ...output['@context'],
            ...composeFieldsContext,
            [propertyName]: fieldContext,
            label: { '@id': 'https://www.w3.org/2000/01/rdf-schema#label' },
        },
    };

    return result;
}
