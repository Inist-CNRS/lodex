import { COVERS } from './cover';
import knownTransformers from './transformers';

const validOperations = new RegExp(Object.keys(knownTransformers).join('|'));

export const validateField = (field) => {
    const properties = ['name', 'label', 'cover'].map((key) => {
        const isValid = !!field[key];
        const isValidNameAndLabel = (isValid && key !== 'cover') ? field[key].length > 2 : true;
        const isValidCover = (isValid && key === 'cover') ? COVERS.includes(field[key]) : true;

        let error = null;
        if (!isValid) {
            error = 'required';
        }
        if (isValid && !isValidNameAndLabel) {
            error = `invalid_${key}`;
        }
        if (isValid && !isValidCover) {
            error = 'invalid_cover';
        }

        return {
            name: key,
            isValid: isValid && isValidNameAndLabel && isValidCover,
            error,
        };
    });

    if (field.scheme && !field.scheme.startsWith('http://') && !field.scheme.startsWith('https://')) {
        properties.push({
            name: 'scheme',
            isValid: false,
            error: 'invalid_scheme',
        });
    }

    const transformers = field.transformers.map(transformer => ({
        name: transformer.operation,
        isValid: validOperations.test(transformer.operation) && Array.isArray(transformer.args),
        error: 'invalid_transformer',
    }));

    const propertiesAreValid = properties.reduce((areValid, p) => areValid && p.isValid, true);
    const transformersAreValid = transformers.reduce((areValid, t) => areValid && t.isValid, true);

    return {
        name: field.name,
        isValid: propertiesAreValid && transformersAreValid,
        properties,
        propertiesAreValid,
        transformers,
        transformersAreValid,
    };
};

export default (allFields) => {
    const fields = allFields.map(validateField);

    return {
        isValid: fields.reduce((isValid, field) => isValid && field.isValid, true),
        fields,
    };
};
