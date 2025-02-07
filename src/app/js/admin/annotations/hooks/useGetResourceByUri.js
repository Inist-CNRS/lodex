import { useQuery } from '@tanstack/react-query';

import fetch from '../../../lib/fetch';
import { getRequest } from '../../../user';
import { getUserSessionStorageInfo } from '../../api/tools';

export function useGetResourceByUri(uri) {
    return useQuery({
        queryFn: async () => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'GET',
                    url: `/api/publishedDataset/ark?uri=${uri}`,
                },
            );
            const { response, error } = await fetch(request);

            if (error) {
                throw error;
            }

            return response;
        },
    });
}
