import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useHistory } from 'react-router-dom';
import { toast } from '../../../../../common/tools/toast';
import { useTranslate } from '../../../i18n/I18NContext';
import fetch from '../../../lib/fetch';
import { getRequest } from '../../../user';
import { getUserSessionStorageInfo } from '../../api/tools';

export function useDeleteAnnotation(id) {
    const history = useHistory();
    const { translate } = useTranslate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'DELETE',
                    url: `/api/annotation/${id}`,
                },
            );
            const { response, error } = await fetch(request);

            if (error) {
                throw error;
            }

            return response;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'get-annotations',
            });

            toast(translate('annotation_delete_success'), {
                type: toast.TYPE.SUCCESS,
            });

            history.push('/annotations');
        },
        onError(error) {
            if (error?.code === 401) {
                history.push('/login');
                return;
            }

            toast(translate('annotation_delete_error'), {
                type: toast.TYPE.ERROR,
            });
        },
    });
}
