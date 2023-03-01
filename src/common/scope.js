export const SCOPE_DATASET = 'dataset';
export const SCOPE_GRAPHIC = 'graphic';
export const SCOPE_COLLECTION = 'collection';
export const SCOPE_DOCUMENT = 'document';

export const hasSimilarScope = scope => field => {
    if (scope === field.scope) {
        return true;
    }
    const similarScopes = [SCOPE_DOCUMENT, SCOPE_COLLECTION];
    return similarScopes.includes(scope) && similarScopes.includes(field.scope);
};

export const getFieldForSpecificScope = (
    fields,
    scope,
    subresourceId = undefined,
) => {
    if (scope === SCOPE_DATASET || scope === SCOPE_GRAPHIC) {
        return fields.filter(
            field =>
                field.scope === SCOPE_GRAPHIC || field.scope === SCOPE_DATASET,
        );
    }

    if (scope === SCOPE_COLLECTION || scope === SCOPE_DOCUMENT) {
        if (subresourceId === undefined) {
            return fields.filter(
                field =>
                    (field.scope === SCOPE_COLLECTION ||
                        field.scope === SCOPE_DOCUMENT) &&
                    field.subresourceId === undefined,
            );
        }

        return fields.filter(
            field =>
                (field.scope === SCOPE_COLLECTION ||
                    field.scope === SCOPE_DOCUMENT) &&
                field.subresourceId === subresourceId,
        );
    }

    return fields;
};

export const SCOPES = [
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
    SCOPE_COLLECTION,
    SCOPE_DOCUMENT,
];
