import fetch from '../../../../src/app/js/lib/fetch';
import {
    getCreateEnrichmentRequest,
    getDeleteEnrichmentRequest,
    getPreviewDataEnrichmentRequest,
    getUpdateEnrichmentRequest,
} from '../../../../src/app/js/user';
import { getUserSessionStorageInfo } from './tools';

// @ts-expect-error TS7006
export const getPreviewEnrichment = (previewEnrichment) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPreviewDataEnrichmentRequest(
        { token },
        previewEnrichment,
    );
    return fetch(request);
};

// @ts-expect-error TS7006
export const createEnrichment = (enrichment) => {
    const { token } = getUserSessionStorageInfo();
    const request = getCreateEnrichmentRequest({ token }, enrichment);
    return fetch(request);
};

// @ts-expect-error TS7006
export const updateEnrichment = (enrichment) => {
    const { token } = getUserSessionStorageInfo();
    const request = getUpdateEnrichmentRequest({ token }, enrichment);
    return fetch(request);
};

// @ts-expect-error TS7006
export const deleteEnrichment = (id) => {
    const { token } = getUserSessionStorageInfo();
    const request = getDeleteEnrichmentRequest({ token }, id);
    return fetch(request);
};

export default {
    getPreviewEnrichment,
    createEnrichment,
    updateEnrichment,
    deleteEnrichment,
};
