import fetch from '../../lib/fetch';
import { getPublishRequest } from '../../user';
import { getUserSessionStorageInfo } from './tools';

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
