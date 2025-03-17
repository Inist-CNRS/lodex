import { useEffect, useMemo } from 'react';
import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import { isURL } from '../../../../common/uris';

export const useRememberVisit = (resource) => {
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
            JSON.parse(localStorage.getItem(`${tenant}-viewed-resources`)) ||
            [];
        if (!viewedResources.includes(resource.uri)) {
            setViewedResources([...viewedResources, resource.uri]);
        }
    }, [resource?.uri]);
};

export const useIsVisited = (resource) => {
    return useMemo(() => {
        if (isURL(resource.uri)) {
            return false;
        }

        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        const viewedResources =
            JSON.parse(localStorage.getItem(`${tenant}-viewed-resources`)) ||
            [];

        return viewedResources.includes(resource.uri);
    }, [resource.uri]);
};

export const useVisitedUris = () => {
    const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
    const viewedResources =
        JSON.parse(localStorage.getItem(`${tenant}-viewed-resources`)) || [];

    return viewedResources;
};
