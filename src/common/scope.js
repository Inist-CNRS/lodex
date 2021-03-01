export const SCOPE_DATASET = 'dataset';
export const SCOPE_GRAPHIC = 'graphic';
export const SCOPE_COLLECTION = 'collection';
export const SCOPE_DOCUMENT = 'document';

export const sameScope = (scopeA, scopeB) => {
    if (scopeA === scopeB) {
        return true;
    }
    if (
        (scopeA === SCOPE_DOCUMENT || scopeA === SCOPE_COLLECTION) &&
        (scopeB === SCOPE_DOCUMENT || scopeB === SCOPE_COLLECTION)
    ) {
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
