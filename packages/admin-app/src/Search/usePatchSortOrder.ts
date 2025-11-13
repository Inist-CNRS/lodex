import { useMutation } from '@tanstack/react-query';
import { toast } from '@lodex/common';
import fieldApi from '../api/field';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { useDispatch } from 'react-redux';
import { changeSortOrder } from '@lodex/frontend-common/fields/reducer';

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
