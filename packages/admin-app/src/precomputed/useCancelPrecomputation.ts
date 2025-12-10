import { toast } from '@lodex/common';
import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loadPrecomputed } from './index';

export const useCancelPrecomputation = () => {
    const { translate } = useTranslate();
    const dispatch = useDispatch();
    const { fetch } = useApiClient();
    const { mutate: cancelPrecomputedJob } = useMutation({
        mutationKey: ['cancel-precomputation'],
        mutationFn: async (precomputedId: string) => {
            await fetch({
                url: `/api/precomputed/${precomputedId}/cancel`,
                method: 'PUT',
            });
        },
        onError: (error) => {
            console.error('Error cancelling precomputation job:', error);
            toast(translate('precomputed_cancel_error'), {
                type: 'error',
            });
        },
        onSuccess: () => {
            toast(translate('precomputed_cancel_success'), {
                type: 'success',
            });
            dispatch(loadPrecomputed());
        },
    });

    return cancelPrecomputedJob;
};
