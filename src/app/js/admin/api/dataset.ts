import fetch from '../../lib/fetch';
import {
    getGetDatasetRequest,
    getGetDatasetColumnsRequest,
    putUpdateDataset,
    getDeleteManyDatasetRowRequest,
    getDeleteFilteredDatasetRowRequest,
} from '../../user';
import { getUserSessionStorageInfo } from './tools';

const getDataset = async ({ filter, skip, limit, sort }) => {
    const { token } = getUserSessionStorageInfo();

    const request = getGetDatasetRequest(
        { token },
        { filter, skip, limit, sort },
    );
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
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return { columns: [] };
        }
        return response;
    });
};

const updateDataset = async ({ uri, field, value }) => {
    const { token } = getUserSessionStorageInfo();

    const request = putUpdateDataset({ token }, { uri, field, value });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

const deleteManyDatasetRows = async (ids) => {
    const { token } = getUserSessionStorageInfo();

    const request = getDeleteManyDatasetRowRequest({ token }, ids);
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

const deleteFilteredDatasetRows = async (filter) => {
    const { token } = getUserSessionStorageInfo();

    const request = getDeleteFilteredDatasetRowRequest({ token }, filter);
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
