import fetch from '../../lib/fetch';
import {
    getConfigTenantAvailableThemeRequest,
    getConfigTenantRequest,
    getUpdateConfigTenantRequest,
} from '../../user';
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

export const updateConfigTenant = (configTenant) => {
    const { token } = getUserSessionStorageInfo();
    const request = getUpdateConfigTenantRequest({ token }, configTenant);
    return fetch(request);
};

export default {
    getConfigTenant,
    updateConfigTenant,
};
