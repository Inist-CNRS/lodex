import { useMutation } from '@tanstack/react-query';
import { toast } from '@lodex/common';
import fieldApi from '../../admin/api/field';
import { useTranslate } from '../../i18n/I18NContext';
import { useDispatch } from 'react-redux';
import { changeSortOrder } from '../../fields';

export function usePatchSortOrder() {
    const { translate } = useTranslate();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn(payload) {
            return fieldApi.patchSortOrder(payload);
        },
        onSuccess(res, payload) {
            if (!res.ok) {
                toast(translate('syndication_error'), {
                    type: 'error',
                });
                return;
            }

            dispatch(changeSortOrder(payload));
        },
    });
}
