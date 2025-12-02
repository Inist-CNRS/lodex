import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@lodex/common';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import { loadFile } from '@lodex/frontend-common/utils/loadFile';

export const useImportPrecomputedResult = () => {
    const { translate } = useTranslate();
    const { mutateAsync } = useMutation({
        mutationFn: async ({
            file,
            precomputedId,
        }: {
            file: File;
            precomputedId: string;
        }) => {
            const { token } = getUserSessionStorageInfo();

            await loadFile(
                `/api/precomputed/${precomputedId}/import`,
                file,
                token,
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
