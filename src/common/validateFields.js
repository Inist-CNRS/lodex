import { COVERS } from './cover';
import knownTransformers from './transformers';

const validOperations = new RegExp(Object.keys(knownTransformers).join('|'));

export const validateField = (field, isContribution = false, fields = []) => {
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
    const propertiesAreValid = properties.reduce((areValid, p) => areValid && p.isValid, true);

    let transformers = [];
    let transformersAreValid = true;
    const composedOf = {};
    let composedOfIsValid = true;

    if (!isContribution) {
        if (field.composedOf && field.transformers) {
            properties.push({
                name: 'transformers',
                isValid: false,
                error: 'composed_of_conflict',
            });
            properties.push({
                name: 'composedOf',
                isValid: false,
                error: 'transformers_conflict',
            });
        }
        if (!field.composedOf && !field.transformers) {
            properties.push({
                name: 'transformers',
                isValid: false,
                error: 'required_or_composed_of_required',
            });
            properties.push({
                name: 'composedOf',
                isValid: false,
                error: 'required_or_transformers_required',
            });
        }

        if (field.transformers && !field.composedOf) {
            transformers = field.transformers.map(transformer => ({
                name: transformer.operation,
                isValid: validOperations.test(transformer.operation) && Array.isArray(transformer.args),
                error: 'invalid_transformer',
            }));

            transformersAreValid = transformers.reduce((areValid, t) => areValid && t.isValid, true);
        }

        if (field.composedOf && !field.transformers) {
            const isValidSeparator = field.composedOf.separator && typeof field.composedOf.separator === 'string';
            const composedOfFields = field.composedOf.fields && field.composedOf.fields
                .map(f => !!fields.find(otherfield => ({
                    name: otherfield.name,
                    isValid: otherfield.name === f,
                    error: 'inexisting_target_field',
                })));

            const areValidFields = composedOfFields.reduce((areValid, f) => areValid && f.isValid, true);
            if (!isValidSeparator) {
                composedOfIsValid = false;
                composedOf.separator = {
                    name: 'separator',
                    isValid: false,
                    error: 'invalid_separator',
                };
            }

            if (!areValidFields) {
                composedOfIsValid = false;
                composedOf.fields = composedOfFields;
            }
        }
    }

    return {
        name: field.name,
        isValid: propertiesAreValid && transformersAreValid && composedOfIsValid,
        properties,
        propertiesAreValid,
        transformers,
        transformersAreValid,
    };
};

export default (allFields) => {
    const fields = allFields.map(field => validateField(field, false, allFields));

    return {
        isValid: fields.reduce((isValid, field) => isValid && field.isValid, true),
        fields,
    };
};
