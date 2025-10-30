import {
    postDuplicateField,
    clearModelRequest,
    getUpdateFieldRequest,
    getPatchSearchableFieldsRequest,
    getPatchOverviewRequest,
    getPatchSortFieldRequest,
    getPatchSortOrderRequest,
} from '../../../../src/app/js/user';

import { store } from '../adminIndex';
import { saveFieldSuccess } from '../../../../src/app/js/fields';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { getUserSessionStorageInfo } from './tools';

// @ts-expect-error TS7031
const duplicateField = async ({ fieldId }) => {
    const { token } = getUserSessionStorageInfo();
    const request = postDuplicateField({ token }, { fieldId });
    // @ts-expect-error TS7031
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
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

// @ts-expect-error TS7006
const patchField = async (field) => {
    const { token } = getUserSessionStorageInfo();
    const request = getUpdateFieldRequest({ token }, field);
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

// @ts-expect-error TS7006
const patchOverview = async (field) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPatchOverviewRequest({ token }, field);
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        store.dispatch(saveFieldSuccess());
        return response;
    });
};

// @ts-expect-error TS7006
const patchSortField = async (field) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPatchSortFieldRequest({ token }, field);
    // @ts-expect-error TS7031
    return fetch(request).then(({ error }) => {
        if (error) {
            return { ok: false };
        }
        store.dispatch(saveFieldSuccess());
        return { ok: true };
    });
};

// @ts-expect-error TS7006
const patchSortOrder = async (order) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPatchSortOrderRequest({ token }, order);
    // @ts-expect-error TS7031
    return fetch(request).then(({ error }) => {
        if (error) {
            return { ok: false };
        }
        store.dispatch(saveFieldSuccess());
        return { ok: true };
    });
};

// @ts-expect-error TS7006
const patchSearchableFields = async (fields) => {
    const { token } = getUserSessionStorageInfo();
    const request = getPatchSearchableFieldsRequest({ token }, fields);
    // @ts-expect-error TS7031
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
