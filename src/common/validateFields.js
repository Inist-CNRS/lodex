import { COVERS, COVER_DOCUMENT } from './cover';
import knownTransformers from './transformers';
import { languages as languagesFromConfig } from '../../config.json';

export const validateLabel = (field) => {
    const result = {
        name: 'label',
        isValid: true,
    };

    if (!field.label) {
        return {
            ...result,
            isValid: false,
            error: 'required',
        };
    }

    if (field.label.length <= 2) {
        return {
            ...result,
            isValid: false,
            error: 'invalid_label',
        };
    }

    return result;
};

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

export const validateTransformers = (field, isContribution) => {
    const result = {
        name: 'transformers',
        isValid: true,
    };

    if (isContribution && !field.transformers) {
        return result;
    }

    if (isContribution && field.transformers) {
        return {
            ...result,
            isValid: false,
            error: 'contribution_no_transformers',
        };
    }

    if ((!field.transformers || !field.transformers.length)) {
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

export const validateComposedOfSeparator = (field) => {
    if (!field.composedOf) {
        return null;
    }

    const result = {
        name: 'composedOf.separator',
        isValid: true,
    };

    const { separator } = field.composedOf;

    if (!separator) {
        return {
            ...result,
            isValid: false,
            error: 'required',
        };
    }

    if (typeof separator !== 'string') {
        return {
            ...result,
            isValid: false,
            error: 'invalid',
        };
    }

    return result;
};

export const validateComposedOfFields = (field) => {
    if (!field.composedOf) {
        return null;
    }

    const result = {
        name: 'composedOf.fields',
        isValid: true,
    };

    const { fields } = field.composedOf;

    if (!fields || fields.filter(f => !!f).length < 2) {
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
        isValid = !!allFields.find(otherfield => otherfield.name === field.completes);
    }

    return {
        name: 'completes',
        isValid,
        error: isValid ? undefined : 'inexisting_target_field',
    };
};

export const validateScheme = (field) => {
    const result = {
        name: 'scheme',
        isValid: true,
    };

    if (!field.scheme) {
        return result;
    }

    if (!field.scheme.startsWith('http://') && !field.scheme.startsWith('https://')) {
        return {
            ...result,
            isValid: false,
            error: 'invalid',
        };
    }

    return result;
};

export const validateTransformer = (transformer) => {
    const transformerOperation = knownTransformers[transformer.operation];
    if (!transformerOperation || !transformer.args) {
        return {
            name: 'transformer.operation',
            isValid: false,
            meta: { operation: transformer.operation },
            error: 'invalid',
        };
    }
    const transformerMeta = transformerOperation.getMetas();
    if (transformerMeta.args.length !== transformer.args.filter(({ value }) => !!value).length) {
        return {
            name: 'transformer.args',
            isValid: false,
            meta: { operation: transformer.operation, args: transformerMeta.args.length },
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

export const validateLanguage = (field, languages = languagesFromConfig) => {
    const result = {
        name: 'language',
        isValid: true,
    };

    if (!field.language || !languages || !languages.length || languages.some(f => f.code === field.language)) {
        return result;
    }

    return {
        ...result,
        isValid: false,
        error: 'invalid',
    };
};
export const isListValid = list => list.reduce((areValid, { isValid }) => areValid && isValid, true);

export const validateField = (field, isContribution = false, fields = []) => {
    const properties = [
        validateLabel(field),
        validateCover(field, isContribution),
        validateScheme(field),
        validateTransformers(field, isContribution),
        validateCompletesField(field, fields),
        validateComposedOf(field, isContribution),
        validateComposedOfSeparator(field),
        validateComposedOfFields(field),
        validateLanguage(field),
    ].filter(d => !!d);

    const propertiesAreValid = isListValid(properties);

    const transformers = validateEachTransformer(field.transformers);
    const transformersAreValid = isListValid(transformers);
    const composedOfFields = validateEachComposedOfFields(field.composedOf && field.composedOf.fields, fields);
    const composedOfFieldsAreValid = isListValid(composedOfFields);

    return {
        name: field.name,
        isValid: propertiesAreValid && transformersAreValid && composedOfFieldsAreValid,
        properties: [
            ...properties,
            ...transformers,
            ...composedOfFields,
        ],
        propertiesAreValid,
        transformers,
        transformersAreValid,
        composedOfFields,
        composedOfFieldsAreValid,
    };
};

export default (allFields) => {
    const fields = allFields.map(field => validateField(field, false, allFields));

    return {
        isValid: fields.reduce((isValid, field) => isValid && field.isValid, true),
        fields,
    };
};
