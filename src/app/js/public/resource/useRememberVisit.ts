import { useEffect, useMemo } from 'react';
import { DEFAULT_TENANT, isURL } from '@lodex/common';

// @ts-expect-error TS7006
export const useRememberVisit = (resource) => {
    // @ts-expect-error TS7006
    const setViewedResources = (resources) => {
        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        localStorage.setItem(
            `${tenant}-viewed-resources`,
            JSON.stringify(resources),
        );
    };

    useEffect(() => {
        if (!resource?.uri) {
            return;
        }

        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        const viewedResources =
            // @ts-expect-error TS2345
            JSON.parse(localStorage.getItem(`${tenant}-viewed-resources`)) ||
            [];
        if (!viewedResources.includes(resource.uri)) {
            setViewedResources([...viewedResources, resource.uri]);
        }
    }, [resource?.uri]);
};

// @ts-expect-error TS7006
export const useIsVisited = (resource) => {
    return useMemo(() => {
        if (isURL(resource.uri)) {
            return false;
        }

        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        const viewedResources =
            // @ts-expect-error TS2345
            JSON.parse(localStorage.getItem(`${tenant}-viewed-resources`)) ||
            [];

        return viewedResources.includes(resource.uri);
    }, [resource.uri]);
};

export const getVisitedUris = () => {
    const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
    const viewedResources =
        // @ts-expect-error TS2345
        JSON.parse(localStorage.getItem(`${tenant}-viewed-resources`)) || [];

    return viewedResources;
};
