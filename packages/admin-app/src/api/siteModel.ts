import fetch from '@lodex/frontend-common/fetch/fetch';
import {
    getSiteModelLaunchRequest,
    getSiteModelRequest,
} from '@lodex/frontend-common/user/reducer';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import type { SiteModelLaunchView, SiteModelView } from '@lodex/common';

export const getSiteModel = async (): Promise<{
    siteModel: SiteModelView | null;
}> => {
    const { token } = getUserSessionStorageInfo();
    const { response, error } = await fetch(getSiteModelRequest({ token }));
    if (error) {
        throw error;
    }
    return response;
};

export const getSiteModelLaunch = async (): Promise<{
    launch: SiteModelLaunchView | null;
}> => {
    const { token } = getUserSessionStorageInfo();
    const { response, error } = await fetch(
        getSiteModelLaunchRequest({ token }),
    );
    if (error) {
        throw error;
    }
    return response;
};
