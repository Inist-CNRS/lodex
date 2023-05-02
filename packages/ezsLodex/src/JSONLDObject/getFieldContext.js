const getFieldContext = (field, scheme = field.scheme) => {
    const fieldContext = {
        '@id': scheme,
    };

    if (field.type) {
        fieldContext['@type'] = field.type;
    }
    if (field.language) {
        fieldContext['@language'] = field.language;
    }

    return fieldContext;
};

export default getFieldContext;
