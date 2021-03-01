export const SCOPE_DATASET = 'dataset';
export const SCOPE_GRAPHIC = 'graphic';
export const SCOPE_COLLECTION = 'collection';
export const SCOPE_DOCUMENT = 'document';

export const isSimilarScope = scopeA => scopeB => {
    if (scopeA === scopeB) {
        return true;
    }
    const similarScopes = [SCOPE_DOCUMENT, SCOPE_COLLECTION];
    if (similarScopes.includes(scopeA) && similarScopes.includes(scopeB)) {
        return true;
    }
    return false;
};

export const SCOPES = [
    SCOPE_DATASET,
    SCOPE_GRAPHIC,
    SCOPE_COLLECTION,
    SCOPE_DOCUMENT,
];
