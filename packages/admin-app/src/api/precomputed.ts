import fetch from '../../../../src/app/js/lib/fetch';
import {
    getCreatePrecomputedRequest,
    getDeletePrecomputedRequest,
    getExportPrecomputedDataRequest,
    getPreviewDataPrecomputedRequest,
    getPreviewPrecomputedDataRequest,
    getUpdatePrecomputedRequest,
} from '../../../../src/app/js/user';
import { getUserSessionStorageInfo } from './tools';
import { type NewPreComputation, type PreComputation } from '@lodex/common';

// @ts-expect-error TS7006
export const getPreviewPrecomputed = (previewPrecomputed) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPreviewDataPrecomputedRequest(
        { token },
        previewPrecomputed,
    );
    return fetch(request);
};

export const createPrecomputed = (precomputed: NewPreComputation) => {
    const { token } = getUserSessionStorageInfo();
    const request = getCreatePrecomputedRequest({ token }, precomputed);
    return fetch(request);
};

export const updatePrecomputed = (precomputed: PreComputation) => {
    const { token } = getUserSessionStorageInfo();
    const request = getUpdatePrecomputedRequest({ token }, precomputed);
    return fetch(request);
};

export const deletePrecomputed = (id: string) => {
    const { token } = getUserSessionStorageInfo();
    const request = getDeletePrecomputedRequest({ token }, id);
    return fetch(request);
};

export const exportPrecomputedData = (id: string) => {
    const { token } = getUserSessionStorageInfo();

    const request = getExportPrecomputedDataRequest({ token }, id);
    return fetch(request, 'blob').then(
        ({ response, error }: { response: Response; error: Error }) => {
            if (error) {
                return error;
            }
            return response;
        },
    );
};

export const previewPrecomputedData = (id: string) => {
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
