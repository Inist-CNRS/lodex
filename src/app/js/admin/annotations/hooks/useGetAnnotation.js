import { useQuery } from '@tanstack/react-query';

import { useHistory } from 'react-router-dom';
import fetch from '../../../lib/fetch';
import { getRequest } from '../../../user';
import { getUserSessionStorageInfo } from '../../api/tools';

export function useGetAnnotation(id) {
    const history = useHistory();
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

            if (error?.code === 401) {
                history.push('/login');
                return;
            }

            if (error) {
                throw error;
            }

            return response;
        },
    });
}
