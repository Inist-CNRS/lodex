import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { updateConfigTenant } from '../api/configTenant';
import { useTranslate } from '../../i18n/I18NContext';

export function useUpdateConfigTenant() {
    const { translate } = useTranslate();
    const history = useHistory();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (configTenant) => {
            const { response, error, rest } =
                await updateConfigTenant(configTenant);

            if (error?.code === 401) {
                history.push('/login');
                return;
            }

            if (error) {
                throw error;
            }

            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['get-config-tenant'], data);
            toast(translate('config_tenant_update_success'), {
                type: toast.TYPE.SUCCESS,
            });
        },
        onError: (error) => {
            toast(translate('config_tenant_update_error'), {
                type: toast.TYPE.ERROR,
            });
        },
    });

    const handleUpdateConfigTenant = useCallback(
        async (configTenant) => {
            return mutation.mutateAsync(configTenant);
        },
        [mutation],
    );

    return useMemo(
        () => ({
            handleUpdateConfigTenant,
            isSubmitting: mutation.status === 'loading',
        }),
        [handleUpdateConfigTenant, mutation.status],
    );
}
