import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useHistory } from 'react-router-dom';
import { toast } from '@lodex/common';
import { useTranslate } from '../../../i18n/I18NContext';
import fetch from '../../../lib/fetch';
import { getRequest } from '../../../user';
import { getUserSessionStorageInfo } from '../../api/tools';

export function useDeleteManyAnnotation() {
    const history = useHistory();
    const { translate } = useTranslate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: string[]) => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'DELETE',
                    url: `/api/annotation`,
                    body: ids,
                },
            );
            const { response, error } = await fetch(request);

            if (error) {
                throw error;
            }

            return response;
        },
        async onSuccess({ deletedCount }) {
            await queryClient.invalidateQueries({
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

            history.push('/annotations');
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
