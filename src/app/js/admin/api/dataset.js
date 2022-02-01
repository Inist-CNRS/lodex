import fetch from '../../lib/fetch';
const { getGetDatasetRequest } = require('../../user');
const { getUserLocalStorageInfo } = require('./tools');

const getDataset = async ({ filter, skip, limit, sort }) => {
    const { token } = getUserLocalStorageInfo();

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

export default { getDataset };
