import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { type CatalogModel } from '@lodex/common';
import { getSiteModel } from '../api/siteModel';
import { fromLoaders } from '../selectors';
import { useDisplayableModels } from '../siteWizard/useDisplayableModels';

export const SITE_MODEL_QUERY_KEY = ['site-model'];

// the memory changes outside of the pages reading it (wizard, model import,
// clear): it is fetched at every mount, and a cached value never decides
export const useSiteModelQuery = () =>
    useQuery({
        queryKey: SITE_MODEL_QUERY_KEY,
        queryFn: getSiteModel,
        refetchOnMount: 'always',
        // a failure falls back at once (classic upload, no recommended theme)
        retry: false,
    });

/**
 * The catalog model the site was generated with by the wizard. Null without memory, or when the model is no longer displayable.
 */
export const useSiteModel = (): {
    isLoading: boolean;
    siteModel: { model: CatalogModel } | null;
} => {
    const models = useDisplayableModels();
    // the displayable models depend on the loaders: until they are loaded (or failed),
    // the site would wrongly look like it has no model
    const haveLoadersSettled = useSelector(fromLoaders.haveLoadersSettled);
    const { data, isFetchedAfterMount } = useSiteModelQuery();

    const siteModel = useMemo(() => {
        const view = data?.siteModel;
        const model = view && models.find(({ id }) => id === view.modelId);
        return view && model ? { model } : null;
    }, [data, models]);

    return {
        isLoading: !isFetchedAfterMount || !haveLoadersSettled,
        siteModel,
    };
};
