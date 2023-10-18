import fetch from '../../lib/fetch';
const { getPublishRequest } = require('../../user');
const { getUserSessionStorageInfo } = require('./tools');

const publish = async () => {
    const { token } = getUserSessionStorageInfo();

    const request = getPublishRequest({ token });
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return error;
        }
        return response;
    });
};

export default {
    publish,
};
