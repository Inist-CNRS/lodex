import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@lodex/common';

export const useImportPrecomputedResult = () => {
    const { fetch } = useApiClient();
    const { translate } = useTranslate();
    const { mutateAsync } = useMutation({
        mutationFn: async ({
            file,
            precomputedId,
        }: {
            file: File;
            precomputedId: string;
        }) => {
            const formData = new FormData();
            formData.append('file', file);
            await fetch(
                {
                    url: `/api/precomputed/${precomputedId}/import`,
                    body: formData,
                    method: 'POST',
                    head: {
                        Accept: 'multipart/form-data',
                    },
                },
                'blob',
            );
        },
        onError: (error) => {
            console.error(error);
            toast(translate('import_error'), {
                type: 'error',
            });
        },
        onSuccess: () => {
            toast(translate('import_successful'), {
                type: 'success',
            });
        },
    });

    return mutateAsync;
};
