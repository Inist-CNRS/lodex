import getFieldContext from './getFieldContext';
import getUri from './getUri';

const mergeClasses = (output, field, data) => {
    const propertyName = field.name;
    const classes = field.classes;
    const fieldContext = getFieldContext(field);
    let property = [];

    if (Array.isArray(data[propertyName])) {
        property = {
            '@id': `${getUri(data.uri)}/classes/${propertyName}`,
            '@type': classes,
            label: data[propertyName],
        };
    }

    return {
        ...output,
        [propertyName]: property,
        '@context': {
            ...output['@context'],
            [propertyName]: fieldContext,
            label: { '@id': 'https://www.w3.org/2000/01/rdf-schema#label' },
        },
    };
};

export default mergeClasses;
