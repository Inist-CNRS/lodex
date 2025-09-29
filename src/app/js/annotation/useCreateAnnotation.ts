import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
// @ts-expect-error TS7016
import { toast } from '../../../common/tools/toast';
import { getUserSessionStorageInfo } from '../admin/api/tools';
import { useTranslate } from '../i18n/I18NContext';
import fetch from '../lib/fetch';
import { getRequest } from '../user';
import { useSaveAnnotationId } from './annotationStorage';

export function useCreateAnnotation() {
    // @ts-expect-error TS2339
    const { translate, locale } = useTranslate();
    const queryClient = useQueryClient();

    const saveAnnotationId = useSaveAnnotationId();

    const mutation = useMutation({
        mutationFn: async (annotation) => {
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
