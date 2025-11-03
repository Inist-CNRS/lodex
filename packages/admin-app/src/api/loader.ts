import fetch from '@lodex/frontend-common/fetch/fetch';
import { getLoaderWithScriptRequest } from '@lodex/frontend-common/user/reducer';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';

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
