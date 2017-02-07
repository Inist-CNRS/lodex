import { COVERS } from './cover';

export const validateField = (field) => {
    const properties = ['name', 'label', 'cover'].reduce((result, key) => {
        const isValid = !!field[key];
        const isValidCover = key === 'cover' ? COVERS.includes(field[key]) : true;

        let error = null;
        if (!isValid) {
            error = 'required';
        }
        if (isValid && !isValidCover) {
            error = 'invalid_cover';
        }

        return result.concat([{
            name: key,
            isValid: isValid && isValidCover,
            error,
        }]);
    }, []);

    return {
        name: field.name,
        isValid: properties.reduce((isValid, property) => isValid && property.isValid, true),
        properties,
    };
};

export default (allFields) => {
    const fields = allFields.map(validateField);

    return {
        isValid: fields.reduce((isValid, field) => isValid && field.isValid, true),
        fields,
    };
};
