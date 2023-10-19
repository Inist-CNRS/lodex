import fetch from '../../lib/fetch';
const {
    getGetDatasetRequest,
    getGetDatasetColumnsRequest,
    putUpdateDataset,
    getDeleteDatasetRowRequest,
} = require('../../user');
const { getUserSessionStorageInfo } = require('./tools');

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

const deleteDatasetRow = async id => {
    const { token } = getUserSessionStorageInfo();

    const request = getDeleteDatasetRowRequest({ token }, id);
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
    deleteDatasetRow,
};
