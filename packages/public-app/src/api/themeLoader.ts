import { getThemeRequest } from '@lodex/frontend-common/user/reducer';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';

export const themeLoader = async () => {
    const { token } = getUserSessionStorageInfo();
    const request = getThemeRequest({ token });
    const { response } = await fetch(request);
    return response;
};
