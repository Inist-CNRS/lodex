import {
    catalogModelSchema,
    getModelDescriptionKey,
    getModelTitleKey,
    type CatalogModel,
} from './modelCatalog';

export type GetDisplayableModelsOptions = {
    availableLoaders: string[];
    /** true only if the key is translated (non-empty) in BOTH French and English */
    hasTranslation: (key: string) => boolean;
};

const parseDisplayableModel = (
    entry: unknown,
    { availableLoaders, hasTranslation }: GetDisplayableModelsOptions,
): CatalogModel | null => {
    const result = catalogModelSchema.safeParse(entry);
    if (!result.success) {
        return null;
    }
    const model = result.data;
    const isDisplayable =
        availableLoaders.includes(model.loader) &&
        hasTranslation(getModelTitleKey(model.id)) &&
        hasTranslation(getModelDescriptionKey(model.id));
    return isDisplayable ? model : null;
};

/**
 * Returns the catalog models that can be offered to the user, in catalog order.
 * Invalid entries are silently skipped. When an id is used several times,
 * only its first occurrence can be displayed. Empty optional fields ('', [] or null)
 * behave like missing fields.
 */
export const getDisplayableModels = (
    models: unknown,
    options: GetDisplayableModelsOptions,
): CatalogModel[] => {
    if (!Array.isArray(models)) {
        return [];
    }
    const seenIds = new Set<unknown>();
    return models.flatMap((entry) => {
        const id = (entry as { id?: unknown } | null)?.id;
        const isFirst = !seenIds.has(id);
        seenIds.add(id);
        const model = isFirst ? parseDisplayableModel(entry, options) : null;
        return model ? [model] : [];
    });
};
