import { useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslate } from '../../i18n/I18NContext';
import { getUserSessionStorageInfo } from '../api/tools';
import { getRequest } from '../../user';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

export function useUpdateAnnotation() {
    const { translate } = useTranslate();
    const history = useHistory();

    const mutation = useMutation({
        mutationFn: async (id, annotation) => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'PUT',
                    url: `/api/annotation/${id}`,
                    body: annotation,
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

            return response.data;
        },
        onSuccess: () => {
            toast(translate('annotation_create_success'), {
                type: toast.TYPE.SUCCESS,
            });
        },
        onError: () => {
            toast(translate('annotation_create_error'), {
                type: toast.TYPE.ERROR,
            });
        },
    });

    const handleUpdateAnnotation = useCallback(
        async (id, annotation) => {
            return mutation.mutateAsync(id, annotation);
        },
        [mutation, translate],
    );

    return useMemo(
        () => ({
            handleUpdateAnnotation,
            isSubmitting: mutation.status === 'loading',
        }),
        [handleUpdateAnnotation, mutation.status],
    );
}
