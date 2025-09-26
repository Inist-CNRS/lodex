import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useTranslate } from '../../../i18n/I18NContext';
import fetch from '../../../lib/fetch';
import { getRequest } from '../../../user';
import { getUserSessionStorageInfo } from '../../api/tools';

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

            history.push('/annotations');
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
        [mutation],
    );

    return useMemo(
        () => ({
            handleUpdateAnnotation,
            isSubmitting: mutation.status === 'loading',
        }),
        [handleUpdateAnnotation, mutation.status],
    );
}
