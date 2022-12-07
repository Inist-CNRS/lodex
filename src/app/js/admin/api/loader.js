import fetch from '../../lib/fetch';
const { getLoaderWithScriptRequest } = require('../../user');
const { getUserLocalStorageInfo } = require('./tools');

const getLoaderWithScript = async ({ name }) => {
    const { token } = getUserLocalStorageInfo();

    const request = getLoaderWithScriptRequest({ token }, { name });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

export default { getLoaderWithScript };
