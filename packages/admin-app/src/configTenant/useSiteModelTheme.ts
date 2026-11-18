import { catalogModelSchema } from '@lodex/common';
import modelsCatalog from '../../../../src/app/custom/models/models-catalog.json';
import { useSiteModelQuery } from '../upload/useSiteModel';

// The theme recommended by the catalog model the wizard generated the site
// with. Unlike useSiteModel, it does not wait for the loaders, which this page
// does not load: the server already checked the model is in the catalog with
// an available loader.
export const useSiteModelTheme = (): string | undefined => {
    const { data, isFetchedAfterMount, isSuccess } = useSiteModelQuery();
    // a value kept after a failed refetch never decides either
    const modelId =
        isFetchedAfterMount && isSuccess ? data?.siteModel?.modelId : undefined;
    if (!modelId) {
        return undefined;
    }
    const entry = modelsCatalog.find(({ id }) => id === modelId);
    return catalogModelSchema.safeParse(entry).data?.theme;
};
