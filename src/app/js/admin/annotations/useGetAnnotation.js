import { useQuery } from '@tanstack/react-query';
import fetch from '../../lib/fetch';
import { getUserSessionStorageInfo } from '../api/tools';
import { getRequest } from '../../user';

export function useGetAnnotation(id) {
    return useQuery({
        queryKey: ['get-annotation', id],
        queryFn: async () => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'GET',
                    url: `/api/annotation/${id}`,
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
