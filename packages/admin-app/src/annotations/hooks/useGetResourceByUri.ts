import { useQuery } from '@tanstack/react-query';

import fetch from '../../../../../src/app/js/lib/fetch';
import { getRequest } from '../../../../../src/app/js/user';
import { getUserSessionStorageInfo } from '../../api/tools';

// @ts-expect-error TS7006
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
