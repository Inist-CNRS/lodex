import { getUserSessionStorageInfo } from '../../admin/api/tools';
import fetch from '../../lib/fetch';
import { getExportPDFRequest } from '../../user';

const exportPDF = async (options) => {
    const { token } = getUserSessionStorageInfo();

    const request = getExportPDFRequest({ token }, options);
    return fetch(request, 'blob').then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

export default {
    exportPDF,
};
