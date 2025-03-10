import { useMutation, useQueryClient } from '@tanstack/react-query';
import { omitBy } from 'lodash';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { toast } from '../../../../../common/tools/toast';
import { useTranslate } from '../../../i18n/I18NContext';
import fetch from '../../../lib/fetch';
import { getRequest } from '../../../user';
import { getUserSessionStorageInfo } from '../../api/tools';

export function useDeleteFilteredAnnotation() {
    const history = useHistory();
    const { translate } = useTranslate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (filter) => {
            const query = qs.stringify(
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
                    type: toast.TYPE.SUCCESS,
                },
            );
        },
        onError(error) {
            if (error?.code === 401) {
                history.push('/login');
                return;
            }

            toast(translate('annotation_delete_many_error'), {
                type: toast.TYPE.ERROR,
            });
        },
    });
}
