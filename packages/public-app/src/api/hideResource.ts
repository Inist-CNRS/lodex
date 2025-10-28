import { getUserSessionStorageInfo } from '../../../admin-app/src/api/tools';
import fetch from '../../../../src/app/js/lib/fetch';
import { getHideResourceRequest } from '../../../../src/app/js/user';

export const hideResource = async ({
    uri,
    reason,
}: {
    uri: string;
    reason: string;
}) => {
    const { token } = getUserSessionStorageInfo();
    const request = getHideResourceRequest({ token }, { uri, reason });
    return fetch(request);
};
