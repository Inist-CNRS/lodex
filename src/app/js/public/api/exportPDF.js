import { getUserLocalStorageInfo } from '../../admin/api/tools';
import fetch from '../../lib/fetch';
import { getExportPDFRequest } from '../../user';

const exportPDF = async () => {
    const { token } = getUserLocalStorageInfo();

    const request = getExportPDFRequest({ token });
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
