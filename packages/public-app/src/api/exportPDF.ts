import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { getExportPDFRequest } from '@lodex/frontend-common/user/reducer';

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
