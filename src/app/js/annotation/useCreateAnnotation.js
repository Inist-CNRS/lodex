import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { toast } from '../../../common/tools/toast';
import { getUserSessionStorageInfo } from '../admin/api/tools';
import { useTranslate } from '../i18n/I18NContext';
import fetch from '../lib/fetch';
import { getRequest } from '../user';

export function useCreateAnnotation() {
    const { translate } = useTranslate();

    const mutation = useMutation({
        mutationFn: async (annotation) => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'POST',
                    url: '/api/annotation',
                    body: annotation,
                },
            );
            const { response, error } = await fetch(request);

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

    const handleCreateAnnotation = useCallback(
        async (annotation) => {
            return mutation.mutateAsync(annotation);
        },
        [mutation, translate],
    );

    return useMemo(
        () => ({
            handleCreateAnnotation,
            isSubmitting: mutation.status === 'loading',
        }),
        [handleCreateAnnotation, mutation.status],
    );
}
