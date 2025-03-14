import { useQuery } from '@tanstack/react-query';

import { useHistory } from 'react-router-dom';
import { getConfigTenantAvailableTheme } from '../api/configTenant';

export function useGetAvailableThemes() {
    const history = useHistory();
    return useQuery({
        queryKey: ['get-available-themes'],
        queryFn: async () => {
            const { response, error } = await getConfigTenantAvailableTheme();
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
