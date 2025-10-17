import { useMutation } from '@tanstack/react-query';
import { toast } from '@lodex/common';
import fieldApi from '../../admin/api/field';
import { useTranslate } from '../../i18n/I18NContext';
import { useDispatch } from 'react-redux';
import { changeOverview } from '../../fields';

export function usePatchFieldOverview() {
    const { translate } = useTranslate();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn(payload) {
            return fieldApi.patchOverview(payload);
        },
        onSuccess(res, payload) {
            if (!res) {
                toast(translate('syndication_error'), {
                    type: toast.TYPE.ERROR,
                });
                return;
            }

            dispatch(changeOverview(payload));
        },
    });
}
