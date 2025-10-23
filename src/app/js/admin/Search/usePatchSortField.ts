import { useMutation } from '@tanstack/react-query';
import { toast } from '../../../../common/tools/toast';
import fieldApi from '../../admin/api/field';
import { useTranslate } from '../../i18n/I18NContext';
import { useDispatch } from 'react-redux';
import { changeSortField } from '../../fields';

export function usePatchSortField() {
    const { translate } = useTranslate();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn(payload) {
            return fieldApi.patchSortField(payload);
        },
        onSuccess(res, payload) {
            if (!res.ok) {
                toast(translate('syndication_error'), {
                    type: 'error',
                });
                return;
            }

            dispatch(changeSortField(payload));
        },
    });
}
