import { getThemeRequest } from '../../user';
import fetch from '../../lib/fetch';
import { getUserSessionStorageInfo } from '../../admin/api/tools';

export const themeLoader = async () => {
    const { token } = getUserSessionStorageInfo();
    const request = getThemeRequest({ token });
    const { response } = await fetch(request);
    return response;
};
