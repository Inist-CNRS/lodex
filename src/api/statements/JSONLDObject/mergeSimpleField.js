import getFieldContext from './getFieldContext';
import formatData from './formatData';

export default function mergeSimpleField(output, field, data) {
    const propertyName = field.name;
    const fieldContext = getFieldContext(field);

    return {
        ...output,
        [propertyName]: formatData(data, propertyName),
        '@context': {
            ...output['@context'],
            [propertyName]: fieldContext,
        },
    };
}
