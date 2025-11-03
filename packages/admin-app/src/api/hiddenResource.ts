import { getUserSessionStorageInfo } from './tools';
import {
    getExportHiddenResources,
    getImportHiddenResources,
} from '@lodex/frontend-common/user/reducer';
import fetch from '@lodex/frontend-common/fetch/fetch';

export const exportHiddenResources = () => {
    const { token } = getUserSessionStorageInfo();
    const request = getExportHiddenResources({ token });
    // @ts-expect-error TS7031
    return fetch(request, 'blob').then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

// @ts-expect-error TS7006
export const importHiddenResources = async (formData) => {
    const { token } = getUserSessionStorageInfo();
    const request = getImportHiddenResources({ token }, formData);
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};
