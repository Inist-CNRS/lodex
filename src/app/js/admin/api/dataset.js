import fetch from '../../lib/fetch';
const { getGetDatasetRequest } = require('../../user');
const { getUserLocalStorageInfo } = require('./tools');

const getDataset = async ({ filter, skip, limit }) => {
    const { token } = getUserLocalStorageInfo();

    const request = getGetDatasetRequest({ token }, { filter, skip, limit });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

export default { getDataset };
