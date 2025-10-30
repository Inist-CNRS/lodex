import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { toast } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { loadFile } from '../../../../../src/app/js/lib/loadFile';
import { getUserSessionStorageInfo } from '../../api/tools';
import { useDownloader } from '../../commons/useDownloader';

export function useImportAnnotations() {
    const { translate } = useTranslate();
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

            // @ts-expect-error TS2345
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
                        // @ts-expect-error TS2339
                        filename: file.name,
                    }),
                    {
                        type: 'success',
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
                    type: 'error',
                },
            );
        },
        onError: () => {
            toast(translate('annotations_import_error'), {
                type: 'error',
            });
        },
    });

    const importAnnotations = useCallback(
        // @ts-expect-error TS7006
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
