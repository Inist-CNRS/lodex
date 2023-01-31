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

export const SCOPES = [
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
    SCOPE_COLLECTION,
    SCOPE_DOCUMENT,
];
