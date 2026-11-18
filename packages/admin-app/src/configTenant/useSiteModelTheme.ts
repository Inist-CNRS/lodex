import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogModelSchema } from '@lodex/common';
import modelsCatalog from '../../../../src/app/custom/models/models-catalog.json';
import { getSiteModel } from '../api/siteModel';
import { SITE_MODEL_QUERY_KEY } from '../upload/useSiteModel';

// The theme recommended by the catalog model the wizard generated the site
// with. Unlike useSiteModel, it does not wait for the loaders, which this page
// does not load: the server already checked the model is in the catalog with
// an available loader.
export const useSiteModelTheme = (): string | undefined => {
    const { data, isFetchedAfterMount, isSuccess } = useQuery({
        queryKey: SITE_MODEL_QUERY_KEY,
        queryFn: getSiteModel,
        refetchOnMount: 'always',
        retry: false,
    });
    // the memory changes outside of this page (manual model import, clear):
    // a cached value, or one kept after a failed refetch, never decides
    const modelId =
        isFetchedAfterMount && isSuccess ? data?.siteModel?.modelId : undefined;

    return useMemo(() => {
        if (!modelId) {
            return undefined;
        }
        const entry = (modelsCatalog as unknown[]).find(
            (model) => (model as { id?: unknown } | null)?.id === modelId,
        );
        const result = catalogModelSchema.safeParse(entry);
        return result.success ? result.data.theme : undefined;
    }, [modelId]);
};
