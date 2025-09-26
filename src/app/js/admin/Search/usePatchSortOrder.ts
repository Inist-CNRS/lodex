import { useMutation } from '@tanstack/react-query';
import { toast } from '../../../../common/tools/toast';
import fieldApi from '../../admin/api/field';
import { useTranslate } from '../../i18n/I18NContext';

export function usePatchSortOrder() {
    const { translate } = useTranslate();

    return useMutation({
        mutationFn(payload) {
            return fieldApi.patchSortOrder(payload);
        },
        onSuccess(res) {
            if (!res.ok) {
                toast(translate('syndication_error'), {
                    type: toast.TYPE.ERROR,
                });
            }
        },
    });
}
