import fetch from '../../lib/fetch';
import {
    getCreateEnrichmentRequest,
    getDeleteEnrichmentRequest,
    getPreviewDataEnrichmentRequest,
    getUpdateEnrichmentRequest,
} from '../../user';
import { getUserSessionStorageInfo } from './tools';

export const getPreviewEnrichment = (previewEnrichment) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPreviewDataEnrichmentRequest(
        { token },
        previewEnrichment,
    );
    return fetch(request);
};

export const createEnrichment = (enrichment) => {
    const { token } = getUserSessionStorageInfo();
    const request = getCreateEnrichmentRequest({ token }, enrichment);
    return fetch(request);
};

export const updateEnrichment = (enrichment) => {
    const { token } = getUserSessionStorageInfo();
    const request = getUpdateEnrichmentRequest({ token }, enrichment);
    return fetch(request);
};

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
