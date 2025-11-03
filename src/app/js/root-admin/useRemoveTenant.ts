import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Tenant } from './types';
import { toast } from 'react-toastify';

export const useRemoveTenant = ({
    onSuccess,
    onError,
}: {
    onSuccess: () => void;
    onError: () => void;
}) => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async ({
            id,
            name,
            deleteDatabase,
        }: {
            id: string;
            name: string;
            deleteDatabase: boolean;
        }): Promise<Tenant[]> => {
            const response = await fetch('/rootAdmin/tenant', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Lodex-Tenant': 'admin',
                },
                method: 'DELETE',
                body: JSON.stringify({ _id: id, name, deleteDatabase }),
            });

            if (response.status === 401) {
                throw new Error('Unauthorized');
            }

            if (response.status === 403) {
                throw new Error('Forbidden');
            }

            if (!response.ok) {
                throw new Error('Failed to delete tenant');
            }

            return response.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['tenants'], data);
            toast.success('Instance supprimée', {
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
                onError();
            } else {
                toast.error("Erreur lors de la suppression de l'instance", {
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
