import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { getHideResourceRequest } from '@lodex/frontend-common/user/reducer';

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
