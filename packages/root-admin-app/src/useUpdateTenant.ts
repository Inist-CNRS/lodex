import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Tenant } from './types';
import { toast } from 'react-toastify';

export const useUpdateTenant = ({
    handleLogout,
    onSuccess,
}: {
    handleLogout: () => void;
    onSuccess: () => void;
}) => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async ({
            id,
            tenant,
        }: {
            id: string;
            tenant: Partial<Tenant>;
        }): Promise<Tenant[]> => {
            const response = await fetch(`/rootAdmin/tenant/${id}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Lodex-Tenant': 'admin',
                },
                method: 'PUT',
                body: JSON.stringify(tenant),
            });

            if (response.status === 401) {
                throw new Error('Unauthorized');
            }

            if (response.status === 403) {
                throw new Error('Forbidden');
            }

            if (!response.ok) {
                throw new Error('Failed to update tenant');
            }

            return response.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['tenants'], data);
            toast.success('Instance modifiée', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: 'light',
            });
            onSuccess();
        },
        onError: (error: Error) => {
            if (error.message === 'Forbidden') {
                toast.error('Action non autorisée', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: 'light',
                });
            } else if (error.message === 'Unauthorized') {
                handleLogout();
            } else {
                toast.error("Erreur lors de la modification de l'instance", {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    theme: 'light',
                });
            }
        },
    });

    return mutate;
};
