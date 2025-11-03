import { useQuery } from '@tanstack/react-query';
import type { Tenant } from './types';

// Custom hook for fetching tenants
export const useTenants = (handleLogout: () => void) => {
    return useQuery({
        queryKey: ['tenants'],
        queryFn: async (): Promise<Tenant[]> => {
            const response = await fetch('/rootAdmin/tenant', {
                credentials: 'include',
                headers: {
                    'X-Lodex-Tenant': 'admin',
                },
            });

            if (response.status === 401) {
                handleLogout();
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error('Failed to fetch tenants');
            }

            return response.json();
        },
    });
};
