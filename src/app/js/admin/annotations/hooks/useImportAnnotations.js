import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { toast } from '../../../../../common/tools/toast';
import { useTranslate } from '../../../i18n/I18NContext';
import { loadFile } from '../../../lib/loadFile';
import { getUserSessionStorageInfo } from '../../api/tools';
import { useDownloader } from '../../commons/useDownloader';

export function useImportAnnotations() {
    const { translate } = useTranslate();
    const history = useHistory();
    const queryClient = useQueryClient();
    const { download } = useDownloader();

    const mutation = useMutation({
        mutationFn: async (file) => {
            const { token } = getUserSessionStorageInfo();

            const response = await loadFile(
                '/api/annotation/import',
                file,
                token,
            );

            const { total, failedImports } = JSON.parse(response);

            return {
                response: { total, failedImports },
                file,
            };
        },
        onSuccess: async ({ response, file }) => {
            await queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'get-annotations',
            });

            if (response.failedImports.length === 0) {
                return toast(
                    translate('annotations_import_success', {
                        filename: file.name,
                    }),
                    {
                        type: toast.TYPE.SUCCESS,
                    },
                );
            }

            const errorFilename = download(
                'annotations_import_error',
                new Blob([JSON.stringify(response.failedImports)], {
                    type: 'application/json',
                }),
            );
            return toast(
                translate('annotations_import_failed_imports', {
                    smart_count: response.failedImports.length,
                    filename: errorFilename,
                }),
                {
                    type: toast.TYPE.ERROR,
                },
            );
        },
        onError: () => {
            toast(translate('annotations_import_error'), {
                type: toast.TYPE.ERROR,
            });
        },
    });

    const importAnnotations = useCallback(
        async (file) => {
            return mutation.mutateAsync(file);
        },
        [mutation],
    );

    return useMemo(
        () => ({
            importAnnotations,
        }),
        [importAnnotations],
    );
}
