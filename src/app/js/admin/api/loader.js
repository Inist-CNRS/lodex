import fetch from '../../lib/fetch';
import { getLoaderWithScriptRequest } from '../../user';
import { getUserLocalStorageInfo } from './tools';

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
