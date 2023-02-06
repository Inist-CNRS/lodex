import fetch from '../../lib/fetch';
import {
    getCreateEnrichmentRequest,
    getDeleteEnrichmentRequest,
    getPreviewDataEnrichmentRequest,
    getUpdateEnrichmentRequest,
} from '../../user';
import { getUserLocalStorageInfo } from './tools';

export const getPreviewEnrichment = previewEnrichment => {
    const { token } = getUserLocalStorageInfo();
    const request = getPreviewDataEnrichmentRequest(
        { token },
        previewEnrichment,
    );
    return fetch(request);
};

export const createEnrichment = enrichment => {
    const { token } = getUserLocalStorageInfo();
    const request = getCreateEnrichmentRequest({ token }, enrichment);
    return fetch(request);
};

export const updateEnrichment = enrichment => {
    const { token } = getUserLocalStorageInfo();
    const request = getUpdateEnrichmentRequest({ token }, enrichment);
    return fetch(request);
};

export const deleteEnrichment = id => {
    const { token } = getUserLocalStorageInfo();
    const request = getDeleteEnrichmentRequest({ token }, id);
    return fetch(request);
};

export default {
    getPreviewEnrichment,
    createEnrichment,
    updateEnrichment,
    deleteEnrichment,
};
