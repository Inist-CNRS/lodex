import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { isSiteGenerationActive, type SiteGenerationView } from '@lodex/common';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import {
    getSiteGeneration,
    relaunchSiteGeneration,
    stopSiteGeneration,
} from '../api/siteGeneration';

export const SITE_GENERATION_QUERY_KEY = ['site-generation'];
const REFETCH_INTERVAL = 5_000;
const UNAUTHORIZED_CODES = [401, 403];

const isUnauthorized = (error: unknown) =>
    UNAUTHORIZED_CODES.includes((error as { code?: number } | null)?.code ?? 0);

// An ongoing generation changes by itself, and a failed or missing fetch must
// not leave an admin without the generation's progress. A refused session
// stops the polling: a login changes the query key and fetches again.
export const getRefetchInterval = (
    data: { generation: SiteGenerationView | null } | undefined,
    query: { state: { status: string; error: unknown } },
): number | false => {
    if (isUnauthorized(query.state.error)) {
        return false;
    }
    if (!data || query.state.status === 'error') {
        return REFETCH_INTERVAL;
    }
    // a stopping generation ends once its job is done
    return isSiteGenerationActive(data.generation?.status)
        ? REFETCH_INTERVAL
        : false;
};

export const useSiteGeneration = () => {
    const queryClient = useQueryClient();
    // the route needs an admin: the query only runs once one is logged in,
    // and a login (or logout) changes its key
    const isAdmin: boolean = useSelector(fromUser.isAdmin);
    const { data, error } = useQuery({
        queryKey: [...SITE_GENERATION_QUERY_KEY, isAdmin],
        queryFn: getSiteGeneration,
        enabled: isAdmin,
        retry: (failureCount, error) =>
            !isUnauthorized(error) && failureCount < 3,
        refetchInterval: getRefetchInterval,
    });

    const onSettled = () =>
        queryClient.invalidateQueries({ queryKey: SITE_GENERATION_QUERY_KEY });
    const relaunchMutation = useMutation({
        mutationFn: relaunchSiteGeneration,
        onSettled,
    });
    const stopMutation = useMutation({
        mutationFn: stopSiteGeneration,
        onSettled,
    });

    return {
        // an expired session must not leave a frozen progress on screen
        generation:
            isAdmin && !isUnauthorized(error) ? data?.generation : undefined,
        relaunch: () => relaunchMutation.mutateAsync(),
        stop: () => stopMutation.mutateAsync(),
        isActing: relaunchMutation.isLoading || stopMutation.isLoading,
        isStopping: stopMutation.isLoading,
    };
};
