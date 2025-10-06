import fetch from '../../lib/fetch';
import { getLoaderWithScriptRequest } from '../../user';
import { getUserSessionStorageInfo } from './tools';

const getLoaderWithScript = async ({ name }: { name: string }) => {
    const { token } = getUserSessionStorageInfo();

    const request = getLoaderWithScriptRequest({ token }, { name });
    return fetch(request).then(
        ({
            response,
            error,
        }: {
            response: { name: string; script: string }[];
            error: Error | null;
        }) => {
            if (error) {
                return [];
            }
            return response;
        },
    );
};

export default { getLoaderWithScript };
