import { FormControl, InputLabel, NativeSelect } from '@mui/material';

import { useTranslate } from '../../../../../src/app/js/i18n/I18NContext';

const scopes = ['home', 'document', 'subRessource', 'facet', 'chart'];

interface FieldScopeFilterProps {
    applyValue(...args: unknown[]): unknown;
    item: {
        value?: string;
    };
}

export const FieldScopeFilter = ({
    applyValue,
    item,
}: FieldScopeFilterProps) => {
    const { translate } = useTranslate();

    return (
        <FormControl>
            <InputLabel id="annotation_status_internal_scopes_filter">
                {translate('annotation_field_internal_scopes')}
            </InputLabel>
            <NativeSelect
                aria-labelledby="annotation_status_internal_scopes_filter"
                // @ts-expect-error TS2322
                label={translate('annotation_field_internal_scopes')}
                onChange={(e) => {
                    applyValue({ ...item, value: e.target.value });
                }}
                value={null}
            >
                {/*
                 // @ts-expect-error TS2322 */}
                <option value={null}></option>
                {scopes.map((scope) => (
                    <option key={scope} value={scope}>
                        {translate(`${scope}_tooltip`)}
                    </option>
                ))}
            </NativeSelect>
        </FormControl>
    );
};
