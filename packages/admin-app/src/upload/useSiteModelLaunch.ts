import { useQuery } from '@tanstack/react-query';
import { type SiteModelLaunchView } from '@lodex/common';
import { getSiteModelLaunch } from '../api/siteModel';

export const SITE_MODEL_LAUNCH_QUERY_KEY = ['site-model', 'launch'];

/**
 * How many enrichments and precomputations a relaunch would run: costly to
 * read, so fetched only when `enabled` (the confirmation is open). `launch` is
 * null while loading, on failure, or when the site has no model.
 */
export const useSiteModelLaunch = (
    enabled: boolean,
): {
    isLoading: boolean;
    isError: boolean;
    launch: SiteModelLaunchView | null;
} => {
    const { data, isFetching, isError } = useQuery({
        queryKey: SITE_MODEL_LAUNCH_QUERY_KEY,
        queryFn: getSiteModelLaunch,
        enabled,
        // the steps change outside of this page (imports, enrichments)
        refetchOnMount: 'always',
        retry: false,
    });

    return {
        isLoading: enabled && isFetching,
        isError,
        launch: data?.launch ?? null,
    };
};
