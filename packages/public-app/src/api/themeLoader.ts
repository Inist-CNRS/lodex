import { getThemeRequest } from '../../../../src/app/js/user';
import fetch from '../../../../src/app/js/lib/fetch';
import { getUserSessionStorageInfo } from '../../../admin-app/src/api/tools';

export const themeLoader = async () => {
    const { token } = getUserSessionStorageInfo();
    const request = getThemeRequest({ token });
    const { response } = await fetch(request);
    return response;
};
