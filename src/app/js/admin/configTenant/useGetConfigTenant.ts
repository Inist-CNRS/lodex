import { useQuery } from '@tanstack/react-query';

import { useHistory } from 'react-router-dom';
import { getConfigTenant } from '../api/configTenant';

export function useGetConfigTenant() {
    const history = useHistory();
    return useQuery({
        queryKey: ['get-config-tenant'],
        queryFn: async () => {
            const { response, error } = await getConfigTenant();
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
