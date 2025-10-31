import { useMutation } from '@tanstack/react-query';
import { toast } from '@lodex/common';
import fieldApi from '../api/field';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { useDispatch } from 'react-redux';
import { changeSortField } from '../../../../src/app/js/fields/reducer';

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
