import { COVERS, COVER_DOCUMENT, COVER_DATASET } from './cover';
import knownTransformers from './transformers';
import languagesList from './languages';

export const validateCover = (field, isContribution) => {
    const result = {
        name: 'cover',
        isValid: true,
    };

    if (!field.cover) {
        return {
            ...result,
            isValid: false,
            error: 'required',
        };
    }

    if (isContribution && field.cover !== COVER_DOCUMENT) {
        return {
            ...result,
            isValid: false,
            error: 'invalid_contribution_cover',
        };
    }

    if (!COVERS.includes(field.cover)) {
        return {
            ...result,
            isValid: false,
            error: 'invalid_cover',
        };
    }

    return result;
};

export const validatePosition = field => {
    const result = {
        name: 'position',
        isValid: true,
    };

    if (typeof field.position === 'undefined' || field.position === null) {
        return {
            ...result,
            isValid: false,
            error: 'required',
        };
    }

    if (field.position < 0) {
        return {
            ...result,
            isValid: false,
            error: 'invalid',
        };
    }

    if (
        field.position === 0 &&
        field.cover !== COVER_DATASET &&
        field.name !== 'uri'
    ) {
        return {
            ...result,
            isValid: false,
            error: 'uri_must_come_first',
        };
    }

    if (field.position > 0 && field.name === 'uri') {
        return {
            ...result,
            isValid: false,
            error: 'uri_must_come_first',
        };
    }

    return result;
};

export const validateTransformers = (field, isContribution) => {
    const result = {
        name: 'transformers',
        isValid: true,
    };

    if (isContribution) {
        return result;
    }

    if (!field.transformers || !field.transformers.length) {
        return {
            ...result,
            isValid: false,
            error: 'required',
        };
    }

    return result;
};

export const validateComposedOf = (field, isContribution) => {
    const result = {
        name: 'composedOf',
        isValid: true,
    };

    if (isContribution && !field.composedOf) {
        return result;
    }

    if (isContribution && field.composedOf) {
        return {
            ...result,
            isValid: false,
            error: 'contribution_no_composed_of',
        };
    }

    return result;
};

export const validateComposedOfFields = field => {
    if (!field.composedOf || !field.composedOf.isComposedOf) {
        return null;
    }

    const result = {
        name: 'composedOf.fields',
        isValid: true,
    };

    const { fields } = field.composedOf;

    if (!fields || fields.length < 2) {
        return {
            ...result,
            isValid: false,
            error: 'required',
        };
    }

    return result;
};

export const validateComposedOfField = (field, allFields) => {
    const isValid = !!allFields.find(otherfield => otherfield.name === field);

    return {
        name: 'composedOf.fields',
        isValid,
        error: isValid ? undefined : 'invalid',
    };
};

export const validateEachComposedOfFields = (fields, allFields) => {
    if (!fields || !fields.length) {
        return [];
    }

    return fields.map(field => validateComposedOfField(field, allFields));
};

export const validateCompletesField = (field, allFields) => {
    let isValid = true;
    if (field.completes) {
        isValid = !!allFields.find(
            otherfield => otherfield.name === field.completes,
        );
    }

    return {
        name: 'completes',
        isValid,
        error: isValid ? undefined : 'inexisting_target_field',
    };
};

export const validateScheme = field => {
    const result = {
        name: 'scheme',
        isValid: true,
    };

    if (!field.scheme) {
        return result;
    }

    if (
        !field.scheme.startsWith('http://') &&
        !field.scheme.startsWith('https://')
    ) {
        return {
            ...result,
            isValid: false,
            error: 'invalid',
        };
    }

    return result;
};

export const validateTransformer = transformer => {
    const transformerOperation = knownTransformers[transformer.operation];
    const transformerArgs = transformer.args || [];

    if (!transformerOperation) {
        return {
            name: 'transformer.operation',
            isValid: false,
            meta: { operation: transformer.operation },
            error: 'invalid',
        };
    }
    const transformerMeta = transformerOperation.getMetas();
    if (
        transformerMeta.args.length >
        transformerArgs.filter(({ value }) => !!value).length
    ) {
        return {
            name: 'transformer.args',
            isValid: false,
            meta: {
                operation: transformer.operation,
                args: transformerMeta.args.length,
            },
            error: 'invalid',
        };
    }

    return {
        name: 'transformer.operation',
        isValid: true,
    };
};

export const validateEachTransformer = (transformers = []) =>
    transformers.map(validateTransformer);

export const validateLanguage = (field, languages = languagesList) => {
    const result = {
        name: 'language',
        isValid: true,
    };

    if (
        !field.language ||
        !languages ||
        !languages.length ||
        languages.some(f => f.code === field.language)
    ) {
        return result;
    }

    return {
        ...result,
        isValid: false,
        error: 'invalid',
    };
};
export const isListValid = list =>
    list.reduce((areValid, { isValid }) => areValid && isValid, true);

export const validateField = (field, isContribution = false, fields = []) => {
    const properties = [
        validateCover(field, isContribution),
        validateScheme(field),
        validatePosition(field),
        validateTransformers(field, isContribution),
        validateCompletesField(field, fields),
        validateComposedOf(field, isContribution),
        validateComposedOfFields(field),
        validateLanguage(field),
    ].filter(d => !!d);

    const propertiesAreValid = isListValid(properties);

    const transformers = validateEachTransformer(field.transformers);
    const transformersAreValid = isListValid(transformers);
    const composedOfFields = validateEachComposedOfFields(
        field.composedOf && field.composedOf.fields,
        fields,
    );
    const composedOfFieldsAreValid = isListValid(composedOfFields);

    return {
        name: field.name,
        isValid:
            propertiesAreValid &&
            transformersAreValid &&
            composedOfFieldsAreValid,
        properties: [...properties, ...transformers, ...composedOfFields],
        propertiesAreValid,
        transformers,
        transformersAreValid,
        composedOfFields,
        composedOfFieldsAreValid,
    };
};

export const validateAddedField = (
    field,
    isContribution = false,
    fields = [],
) => {
    const properties = [
        validateScheme(field),
        validateCompletesField(field, fields),
        validateComposedOf(field, isContribution),
        validateComposedOfFields(field),
        validateLanguage(field),
    ].filter(d => !!d);

    const propertiesAreValid = isListValid(properties);

    const transformers = validateEachTransformer(field.transformers);
    const transformersAreValid = isListValid(transformers);
    const composedOfFields = validateEachComposedOfFields(
        field.composedOf && field.composedOf.fields,
        fields,
    );
    const composedOfFieldsAreValid = isListValid(composedOfFields);

    return {
        name: field.name,
        isValid:
            propertiesAreValid &&
            transformersAreValid &&
            composedOfFieldsAreValid,
        properties: [...properties, ...transformers, ...composedOfFields],
        propertiesAreValid,
        transformers,
        transformersAreValid,
        composedOfFields,
        composedOfFieldsAreValid,
    };
};

export default allFields => {
    const fields = allFields.map(field =>
        validateField(field, false, allFields),
    );

    return {
        isValid: fields.reduce(
            (isValid, field) => isValid && field.isValid,
            true,
        ),
        fields,
    };
};
