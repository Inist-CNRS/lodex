import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { toast } from '@lodex/common';
import { getUserSessionStorageInfo } from '../../../../packages/admin-app/src/api/tools';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { useSaveAnnotationId } from './annotationStorage';
import { getRequest } from '../../../../src/app/js/user/reducer';

export function useCreateAnnotation() {
    const { translate, locale } = useTranslate();
    const queryClient = useQueryClient();

    const saveAnnotationId = useSaveAnnotationId();

    const mutation = useMutation({
        mutationFn: async (annotation: Record<string, unknown>) => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'POST',
                    url: `/api/annotation?locale=${locale}`,
                    body: annotation,
                },
            );
            const { response, error } = await fetch(request);

            if (error) {
                throw error;
            }

            return response.data;
        },
        onSuccess: async (data) => {
            await queryClient.resetQueries({
                predicate: (query) => {
                    return (
                        query.queryKey[0] === 'field-annotations' &&
                        query.queryKey[1] === data.fieldId
                    );
                },
            });

            saveAnnotationId(data);
            toast(translate('annotation_create_success'), {
                type: 'success',
            });
        },
        onError: () => {
            toast(translate('annotation_create_error'), {
                type: 'error',
            });
        },
    });

    const handleCreateAnnotation = useCallback(
        // @ts-expect-error TS7006
        async (annotation) => {
            return mutation.mutateAsync(annotation);
        },
        [mutation],
    );

    return useMemo(
        () => ({
            handleCreateAnnotation,
            isSubmitting: mutation.status === 'loading',
        }),
        [handleCreateAnnotation, mutation.status],
    );
}
