import fetch from '@lodex/frontend-common/fetch/fetch';
import {
    getConfigTenantAvailableThemeRequest,
    getConfigTenantRequest,
    getUpdateConfigTenantRequest,
} from '@lodex/frontend-common/user/reducer';
import { getUserSessionStorageInfo } from './tools';

export const getConfigTenantAvailableTheme = () => {
    const { token } = getUserSessionStorageInfo();
    const request = getConfigTenantAvailableThemeRequest({ token });
    return fetch(request);
};

export const getConfigTenant = () => {
    const { token } = getUserSessionStorageInfo();
    const request = getConfigTenantRequest({ token });
    return fetch(request);
};

// @ts-expect-error TS7006
export const updateConfigTenant = (configTenant) => {
    const { token } = getUserSessionStorageInfo();
    const request = getUpdateConfigTenantRequest({ token }, configTenant);
    return fetch(request);
};

export default {
    getConfigTenant,
    updateConfigTenant,
};
