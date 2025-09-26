import fetch from '../../lib/fetch';
import {
    getCreatePrecomputedRequest,
    getDeletePrecomputedRequest,
    getExportPrecomputedDataRequest,
    getPreviewDataPrecomputedRequest,
    getPreviewPrecomputedDataRequest,
    getUpdatePrecomputedRequest,
} from '../../user';
import { getUserSessionStorageInfo } from './tools';

// @ts-expect-error TS7006
export const getPreviewPrecomputed = (previewPrecomputed) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPreviewDataPrecomputedRequest(
        { token },
        previewPrecomputed,
    );
    return fetch(request);
};

// @ts-expect-error TS7006
export const createPrecomputed = (precomputed) => {
    const { token } = getUserSessionStorageInfo();
    const request = getCreatePrecomputedRequest({ token }, precomputed);
    return fetch(request);
};

// @ts-expect-error TS7006
export const updatePrecomputed = (precomputed) => {
    const { token } = getUserSessionStorageInfo();
    const request = getUpdatePrecomputedRequest({ token }, precomputed);
    return fetch(request);
};

// @ts-expect-error TS7006
export const deletePrecomputed = (id) => {
    const { token } = getUserSessionStorageInfo();
    const request = getDeletePrecomputedRequest({ token }, id);
    return fetch(request);
};

// @ts-expect-error TS7006
export const exportPrecomputedData = (id) => {
    const { token } = getUserSessionStorageInfo();

    const request = getExportPrecomputedDataRequest({ token }, id);
    // @ts-expect-error TS7031
    return fetch(request, 'blob').then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

// @ts-expect-error TS7006
export const previewPrecomputedData = (id) => {
    const { token } = getUserSessionStorageInfo();

    const request = getPreviewPrecomputedDataRequest({ token }, id);
    return fetch(request);
};

export default {
    getPreviewPrecomputed,
    createPrecomputed,
    updatePrecomputed,
    deletePrecomputed,
    exportPrecomputedData,
    getPreviewPrecomputedDataRequest,
};
