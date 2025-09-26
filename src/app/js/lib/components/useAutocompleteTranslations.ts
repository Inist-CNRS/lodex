import { useMemo } from 'react';
import { useTranslate } from '../../i18n/I18NContext';

export function useAutocompleteTranslations() {
    const { translate } = useTranslate();

    return useMemo(
        () => ({
            clearText: translate('autocomplete_clear'),
            closeText: translate('autocomplete_close'),
            noOptionsText: translate('autocomplete_no_options'),
            openText: translate('autocomplete_open'),
        }),
        [translate],
    );
}
