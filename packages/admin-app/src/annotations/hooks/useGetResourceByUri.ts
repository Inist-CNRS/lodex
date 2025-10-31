import { useQuery } from '@tanstack/react-query';

import fetch from '@lodex/frontend-common/fetch/fetch';
import { getRequest } from '../../../../../src/app/js/user/reducer';
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
