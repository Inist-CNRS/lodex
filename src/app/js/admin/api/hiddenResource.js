import { getUserSessionStorageInfo } from '../api/tools';
import { getExportHiddenResources } from '../../user';
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
