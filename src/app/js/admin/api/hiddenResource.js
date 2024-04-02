import { getUserSessionStorageInfo } from '../api/tools';
import { getExportHiddenResources, getImportHiddenResources } from '../../user';
import fetch from '../../lib/fetch';

export const exportHiddenResources = () => {
    const { token } = getUserSessionStorageInfo();
    const request = getExportHiddenResources({ token });
    return fetch(request, 'blob').then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

export const importHiddenResources = async (formData) => {
    const { token } = getUserSessionStorageInfo();
    const request = getImportHiddenResources({ token }, formData);
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};
