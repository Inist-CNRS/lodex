import { host } from 'config';
import getFieldContext from './getFieldContext';
import getUri from './getUri';
import formatData from './formatData';

const mergeClasses = (output, field, data) => {
    const propertyName = field.name;
    const classes = field.classes;
    const fieldContext = getFieldContext(field);
    const property = {
        '@id': `${getUri(data.uri || host.concat('/'))}/classes/${propertyName}`,
        '@type': classes,
        label: formatData(data, propertyName),
    };

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
