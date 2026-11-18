import fetch from '@lodex/frontend-common/fetch/fetch';
import {
    getRelaunchSiteGenerationRequest,
    getSiteGenerationRequest,
    getStopSiteGenerationRequest,
} from '@lodex/frontend-common/user/reducer';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import type { SiteGenerationView } from '@lodex/common';

export const getSiteGeneration = async (): Promise<{
    generation: SiteGenerationView | null;
}> => {
    const { token } = getUserSessionStorageInfo();
    const { response, error } = await fetch(
        getSiteGenerationRequest({ token }),
    );
    if (error) {
        throw error;
    }
    return response;
};

export const relaunchSiteGeneration = async () => {
    const { token } = getUserSessionStorageInfo();
    const { error } = await fetch(getRelaunchSiteGenerationRequest({ token }));
    if (error) {
        throw error;
    }
};

export const stopSiteGeneration = async () => {
    const { token } = getUserSessionStorageInfo();
    const { error } = await fetch(getStopSiteGenerationRequest({ token }));
    if (error) {
        throw error;
    }
};
