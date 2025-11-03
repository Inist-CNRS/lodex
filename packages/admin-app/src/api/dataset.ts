import fetch from '@lodex/frontend-common/fetch/fetch';
import {
    getGetDatasetRequest,
    getGetDatasetColumnsRequest,
    putUpdateDataset,
    getDeleteManyDatasetRowRequest,
    getDeleteFilteredDatasetRowRequest,
} from '@lodex/frontend-common/user/reducer';
import { getUserSessionStorageInfo } from './tools';

// @ts-expect-error TS7031
const getDataset = async ({ filter, skip, limit, sort }) => {
    const { token } = getUserSessionStorageInfo();

    const request = getGetDatasetRequest(
        { token },
        { filter, skip, limit, sort },
    );
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

const getDatasetColumns = async () => {
    const { token } = getUserSessionStorageInfo();
    const request = getGetDatasetColumnsRequest({ token });
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return { columns: [] };
        }
        return response;
    });
};

// @ts-expect-error TS7031
const updateDataset = async ({ uri, field, value }) => {
    const { token } = getUserSessionStorageInfo();

    const request = putUpdateDataset({ token }, { uri, field, value });
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

// @ts-expect-error TS7006
const deleteManyDatasetRows = async (ids) => {
    const { token } = getUserSessionStorageInfo();

    const request = getDeleteManyDatasetRowRequest({ token }, ids);
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

// @ts-expect-error TS7006
const deleteFilteredDatasetRows = async (filter) => {
    const { token } = getUserSessionStorageInfo();

    const request = getDeleteFilteredDatasetRowRequest({ token }, filter);
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

export default {
    getDataset,
    getDatasetColumns,
    updateDataset,
    deleteManyDatasetRows,
    deleteFilteredDatasetRows,
};
