import { useQuery } from '@tanstack/react-query';

import { useHistory } from 'react-router-dom';
import { getConfigTenantAvailableTheme } from '../api/configTenant';

// a theme installed on this instance, as returned by GET /api/themes
export type AvailableTheme = {
    value: string;
    name: { en: string; fr: string };
    description: { en: string; fr: string };
    defaultVariables: Record<string, string>;
};

export const getThemeLabel = (theme: AvailableTheme, locale: 'en' | 'fr') =>
    `${theme.name[locale]} - ${theme.description[locale]}`;

export function useGetAvailableThemes({
    enabled = true,
    retry,
}: { enabled?: boolean; retry?: boolean } = {}) {
    const history = useHistory();
    return useQuery({
        queryKey: ['get-available-themes'],
        enabled,
        retry,
        queryFn: async (): Promise<AvailableTheme[] | undefined> => {
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
