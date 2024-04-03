export const SCOPE_DATASET = 'dataset';
export const SCOPE_GRAPHIC = 'graphic';
export const SCOPE_COLLECTION = 'collection';
export const SCOPE_DOCUMENT = 'document';

export const hasSimilarScope = (scope) => (field) => {
    if (scope === field.scope) {
        return true;
    }
    const similarScopes = [SCOPE_DOCUMENT, SCOPE_COLLECTION];
    return similarScopes.includes(scope) && similarScopes.includes(field.scope);
};

/**
 * @param fields
 * @param scope
 * @param subresourceId
 * @return {Array<{
 *  _id: string;
 *  classes: Array<any>;
 *  count: number;
 *  display: boolean;
 *  format: any;
 *  internalName: string;
 *  label: string;
 *  name: string;
 *  overview: number;
 *  position: number;
 *  scope: string;
 *  searchable: boolean;
 *  transformers: Array<any>
 * }>}
 */
export const getFieldForSpecificScope = (
    fields,
    scope,
    subresourceId = undefined,
) => {
    if (scope === SCOPE_DATASET || scope === SCOPE_GRAPHIC) {
        return fields.filter(
            (field) =>
                field.scope === SCOPE_GRAPHIC || field.scope === SCOPE_DATASET,
        );
    }

    if (scope === SCOPE_COLLECTION || scope === SCOPE_DOCUMENT) {
        if (subresourceId === undefined) {
            return fields.filter(
                (field) =>
                    (field.scope === SCOPE_COLLECTION ||
                        field.scope === SCOPE_DOCUMENT) &&
                    field.subresourceId === undefined,
            );
        }

        return fields.filter(
            (field) =>
                (field.scope === SCOPE_COLLECTION ||
                    field.scope === SCOPE_DOCUMENT) &&
                field.subresourceId === subresourceId,
        );
    }

    return fields;
};

export const getFieldToAnnotateForSpecificScope = (
    fields,
    scope,
    subresourceId = undefined,
) => {
    if (scope === SCOPE_DATASET) {
        return fields.filter((field) => field.scope === SCOPE_DATASET);
    }
    if (scope === SCOPE_GRAPHIC) {
        return fields.filter((field) => field.scope === SCOPE_GRAPHIC);
    }

    if (scope === SCOPE_COLLECTION || scope === SCOPE_DOCUMENT) {
        if (subresourceId === undefined) {
            return fields.filter(
                (field) =>
                    (field.scope === SCOPE_COLLECTION ||
                        field.scope === SCOPE_DOCUMENT) &&
                    field.subresourceId === undefined,
            );
        }

        return fields.filter(
            (field) =>
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
