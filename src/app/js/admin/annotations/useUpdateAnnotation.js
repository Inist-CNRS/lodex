import { useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslate } from '../../i18n/I18NContext';
import { getUserSessionStorageInfo } from '../api/tools';
import { getRequest } from '../../user';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import fetch from '../../lib/fetch';

export function useUpdateAnnotation() {
    const { translate } = useTranslate();
    const history = useHistory();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ id, annotation }) => {
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
        onSuccess: (data) => {
            const currentData = queryClient.getQueryData([
                'get-annotation',
                data._id,
            ]);
            queryClient.setQueryData(['get-annotation', data._id], {
                field: currentData.field,
                resource: currentData.resource,
                ...data,
            });
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'get-annotations',
            });
            toast(translate('annotation_update_success'), {
                type: toast.TYPE.SUCCESS,
            });
        },
        onError: () => {
            toast(translate('annotation_update_error'), {
                type: toast.TYPE.ERROR,
            });
        },
    });

    const handleUpdateAnnotation = useCallback(
        async (id, annotation) => {
            return mutation.mutateAsync({ id, annotation });
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
