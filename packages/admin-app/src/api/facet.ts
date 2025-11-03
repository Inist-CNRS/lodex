import fetch from '@lodex/frontend-common/fetch/fetch';
import { getLoadFacetValuesRequest } from '@lodex/frontend-common/user/reducer';
import { getUserSessionStorageInfo } from './tools';

const getFacetsFiltered = async ({
    field,
    filter,
    currentPage = 0,
    perPage = 10,
    sort = {},
}: {
    field: string;
    filter: string;
    currentPage?: number;
    perPage?: number;
    sort?: Record<string, unknown>;
}) => {
    const { token } = getUserSessionStorageInfo();
    const request = getLoadFacetValuesRequest(
        { token },
        { field, filter, currentPage, perPage, sort },
    );
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

export default { getFacetsFiltered };
