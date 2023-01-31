const {
    postDuplicateField,
    clearModelRequest,
    getUpdateFieldRequest,
    getPatchSearchableFieldsRequest,
} = require('../../user');

import { getUserLocalStorageInfo } from './tools';
import fetch from '../../lib/fetch';
import { saveFieldSuccess } from '../../fields';
import { store } from '..';

const duplicateField = async ({ fieldId }) => {
    const { token } = getUserLocalStorageInfo();
    const request = postDuplicateField({ token }, { fieldId });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

const clearModel = async () => {
    const { token } = getUserLocalStorageInfo();
    const request = clearModelRequest({ token });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

const patchField = async field => {
    const { token } = getUserLocalStorageInfo();
    const request = getUpdateFieldRequest({ token }, field);
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        store.dispatch(saveFieldSuccess());
        return response;
    });
};

const patchSearchableFields = async fields => {
    const { token } = getUserLocalStorageInfo();
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
    patchSearchableFields,
};
