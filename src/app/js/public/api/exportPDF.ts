import { getUserSessionStorageInfo } from '../../admin/api/tools';
import fetch from '../../lib/fetch';
import { getExportPDFRequest } from '../../user';

// @ts-expect-error TS7006
const exportPDF = async (options) => {
    const { token } = getUserSessionStorageInfo();

    const request = getExportPDFRequest({ token }, options);
    // @ts-expect-error TS7031
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
