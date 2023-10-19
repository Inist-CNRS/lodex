import fetch from '../../lib/fetch';
import {
    getCreatePrecomputedRequest,
    getDeletePrecomputedRequest,
    getPreviewDataPrecomputedRequest,
    getUpdatePrecomputedRequest,
} from '../../user';
import { getUserSessionStorageInfo } from './tools';

export const getPreviewPrecomputed = previewPrecomputed => {
    const { token } = getUserSessionStorageInfo();
    const request = getPreviewDataPrecomputedRequest(
        { token },
        previewPrecomputed,
    );
    return fetch(request);
};

export const createPrecomputed = precomputed => {
    const { token } = getUserSessionStorageInfo();
    const request = getCreatePrecomputedRequest({ token }, precomputed);
    return fetch(request);
};

export const updatePrecomputed = precomputed => {
    const { token } = getUserSessionStorageInfo();
    const request = getUpdatePrecomputedRequest({ token }, precomputed);
    return fetch(request);
};

export const deletePrecomputed = id => {
    const { token } = getUserSessionStorageInfo();
    const request = getDeletePrecomputedRequest({ token }, id);
    return fetch(request);
};

export default {
    getPreviewPrecomputed,
    createPrecomputed,
    updatePrecomputed,
    deletePrecomputed,
};
