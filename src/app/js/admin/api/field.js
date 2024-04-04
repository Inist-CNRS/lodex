const {
    postDuplicateField,
    clearModelRequest,
    getUpdateFieldRequest,
    getPatchSearchableFieldsRequest,
    getPatchOverviewRequest,
} = require('../../user');

import { getUserSessionStorageInfo } from './tools';
import fetch from '../../lib/fetch';
import { saveFieldSuccess } from '../../fields';
import { store } from '..';

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
    patchSearchableFields,
};
