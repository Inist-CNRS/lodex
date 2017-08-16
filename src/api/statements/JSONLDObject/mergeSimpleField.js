import getFieldContext from './getFieldContext';

export default function mergeSimpleField(output, field, data) {
    const propertyName = field.name;
    const fieldContext = getFieldContext(field);

    return {
        ...output,
        [propertyName]: data[propertyName],
        '@context': {
            ...output['@context'],
            [propertyName]: fieldContext,
        },
    };
}
