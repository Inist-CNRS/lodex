import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { getRequest } from '@lodex/frontend-common/user/reducer';
import { getUserSessionStorageInfo } from '../../api/tools';

export function useUpdateAnnotation() {
    const { translate } = useTranslate();
    const history = useHistory();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        // @ts-expect-error TS2339
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
                // @ts-expect-error TS18046
                field: currentData.field,
                // @ts-expect-error TS18046
                resource: currentData.resource,
                ...data,
            });
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'get-annotations',
            });
            toast(translate('annotation_update_success'), {
                type: 'success',
            });

            history.push('/annotations');
        },
        onError: () => {
            toast(translate('annotation_update_error'), {
                type: 'error',
            });
        },
    });

    const handleUpdateAnnotation = useCallback(
        // @ts-expect-error TS7006
        async (id, annotation) => {
            // @ts-expect-error TS2345
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
