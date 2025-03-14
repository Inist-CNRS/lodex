const {
    postDuplicateField,
    clearModelRequest,
    getUpdateFieldRequest,
    getPatchSearchableFieldsRequest,
    getPatchOverviewRequest,
    getPatchSortFieldRequest,
    getPatchSortOrderRequest,
} = require('../../user');

import { store } from '..';
import { saveFieldSuccess } from '../../fields';
import fetch from '../../lib/fetch';
import { getUserSessionStorageInfo } from './tools';

const duplicateField = async ({ fieldId }) => {
    const { token } = getUserSessionStorageInfo();
    const request = postDuplicateField({ token }, { fieldId });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

const clearModel = async () => {
    const { token } = getUserSessionStorageInfo();
    const request = clearModelRequest({ token });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

const patchField = async (field) => {
    const { token } = getUserSessionStorageInfo();
    const request = getUpdateFieldRequest({ token }, field);
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

const patchOverview = async (field) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPatchOverviewRequest({ token }, field);
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        store.dispatch(saveFieldSuccess());
        return response;
    });
};

const patchSortField = async (field) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPatchSortFieldRequest({ token }, field);
    return fetch(request).then(({ error }) => {
        if (error) {
            return { ok: false };
        }
        store.dispatch(saveFieldSuccess());
        return { ok: true };
    });
};

const patchSortOrder = async (order) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPatchSortOrderRequest({ token }, order);
    return fetch(request).then(({ error }) => {
        if (error) {
            return { ok: false };
        }
        store.dispatch(saveFieldSuccess());
        return { ok: true };
    });
};

const patchSearchableFields = async (fields) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPatchSearchableFieldsRequest({ token }, fields);
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        store.dispatch(saveFieldSuccess());
        return response;
    });
};

export default {
    duplicateField,
    clearModel,
    patchField,
    patchOverview,
    patchSortField,
    patchSortOrder,
    patchSearchableFields,
};
