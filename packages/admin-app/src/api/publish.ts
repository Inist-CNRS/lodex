import fetch from '@lodex/frontend-common/fetch/fetch';
import { getPublishRequest } from '../../../../src/app/js/user';
import { getUserSessionStorageInfo } from './tools';

const publish = async () => {
    const { token } = getUserSessionStorageInfo();

    const request = getPublishRequest({ token });
    // @ts-expect-error TS7031
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
