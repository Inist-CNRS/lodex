import { useMutation, useQueryClient } from '@tanstack/react-query';
import { omitBy } from 'lodash';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { toast } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { getRequest } from '@lodex/frontend-common/user/reducer';
import { getUserSessionStorageInfo } from '../../api/tools';

export function useDeleteFilteredAnnotation() {
    const history = useHistory();
    const { translate } = useTranslate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (filter) => {
            const query = qs.stringify(
                // @ts-expect-error TS7006
                omitBy(filter, (value) => value === null || value === ''),
            );

            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'DELETE',
                    url: `/api/annotation/batch-delete-filter?${query}`,
                },
            );
            const { response, error } = await fetch(request);

            if (error) {
                throw error;
            }

            return response;
        },
        async onSuccess({ deletedCount }) {
            await queryClient.resetQueries({
                predicate: (query) => query.queryKey[0] === 'get-annotations',
            });

            toast(
                translate('annotation_delete_many_success', {
                    smart_count: deletedCount,
                }),
                {
                    type: 'success',
                },
            );
        },
        onError(error) {
            // @ts-expect-error TS2339
            if (error?.code === 401) {
                history.push('/login');
                return;
            }

            toast(translate('annotation_delete_many_error'), {
                type: 'error',
            });
        },
    });
}
