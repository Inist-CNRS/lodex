import { useQuery } from '@tanstack/react-query';

import { useHistory } from 'react-router-dom';
import fetch from '../lib/fetch';
import { getRequest } from '../user';
import { getUserSessionStorageInfo } from '../admin/api/tools';

export function useCanAnnotate() {
    const history = useHistory();
    const { data } = useQuery({
        queryKey: ['can-annotate'],
        queryFn: async () => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'GET',
                    url: `/api/annotation/can-annotate`,
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

            return !!response;
        },
    });

    return data;
}
