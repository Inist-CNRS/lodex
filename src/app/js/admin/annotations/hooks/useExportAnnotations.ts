import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import fetch from '../../../lib/fetch';
import { getRequest } from '../../../user';
import { getUserSessionStorageInfo } from '../../api/tools';
import { useDownloader } from '../../commons/useDownloader';

export function useExportAnnotations() {
    const history = useHistory();
    const { download } = useDownloader();

    const mutation = useMutation({
        mutationFn: async () => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'GET',
                    url: '/api/annotation/export',
                },
            );
            const { response, error } = await fetch(request, 'blob');

            if (error?.code === 401) {
                history.push('/login');
                return;
            }

            if (error) {
                throw error;
            }

            return response;
        },
        onSuccess: (blob) => {
            download('annotations', blob);
        },
        onError: () => {},
    });

    const exportAnnotations = useCallback(async () => {
        return mutation.mutateAsync();
    }, [mutation]);

    return useMemo(
        () => ({
            exportAnnotations,
        }),
        [exportAnnotations],
    );
}
