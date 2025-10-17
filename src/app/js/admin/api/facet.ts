import fetch from '../../lib/fetch';
import { getLoadFacetValuesRequest } from '../../user';
import { getUserSessionStorageInfo } from './tools';

const getFacetsFiltered = async ({
    field,
    filter,
    currentPage = 0,
    perPage = 10,
    sort = {},
}) => {
    const { token } = getUserSessionStorageInfo();
    const request = getLoadFacetValuesRequest(
        { token },
        { field, filter, currentPage, perPage, sort },
    );
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

export default { getFacetsFiltered };
