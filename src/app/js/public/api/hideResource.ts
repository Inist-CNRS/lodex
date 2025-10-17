import { getUserSessionStorageInfo } from '../../admin/api/tools';
import fetch from '../../lib/fetch';
import { getHideResourceRequest } from '../../user';

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
