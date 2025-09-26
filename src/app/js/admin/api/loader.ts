import fetch from '../../lib/fetch';
import { getLoaderWithScriptRequest } from '../../user';
import { getUserSessionStorageInfo } from './tools';

// @ts-expect-error TS7031
const getLoaderWithScript = async ({ name }) => {
    const { token } = getUserSessionStorageInfo();

    const request = getLoaderWithScriptRequest({ token }, { name });
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

export default { getLoaderWithScript };
