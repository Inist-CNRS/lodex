import { useQuery } from '@tanstack/react-query';
import fetch from '../../lib/fetch';
import { getUserSessionStorageInfo } from '../api/tools';
import { getRequest } from '../../user';

export function useGetAnnotations() {
    return useQuery({
        queryFn: async () => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'GET',
                    url: '/api/annotation',
                },
            );
            console.log({ request });
            const { response, error } = await fetch(request);

            console.log({ response, error });

            if (error) {
                throw error;
            }

            return response;
        },
    });
}
