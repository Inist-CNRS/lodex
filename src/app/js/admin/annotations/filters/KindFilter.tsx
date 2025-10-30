import { FormControl, InputLabel, NativeSelect } from '@mui/material';
import { kinds } from '@lodex/common';
import { useTranslate } from '../../../i18n/I18NContext';

interface KindFilterProps {
    applyValue(...args: unknown[]): unknown;
    item: {
        value?: string;
    };
}

export const KindFilter = ({ applyValue, item }: KindFilterProps) => {
    const { translate } = useTranslate();

    return (
        <FormControl>
            <InputLabel id="annotation_kind_filter">
                {translate('annotation_kind')}
            </InputLabel>
            <NativeSelect
                aria-labelledby="annotation_kind_filter"
                // @ts-expect-error TS2322
                label={translate('annotation_status')}
                onChange={(e) => {
                    applyValue({ ...item, value: e.target.value });
                }}
                value={null}
            >
                {/*
                 // @ts-expect-error TS2322 */}
                <option value={null}></option>
                {kinds.map((kind) => (
                    <option key={kind} value={kind}>
                        {translate(kind)}
                    </option>
                ))}
            </NativeSelect>
        </FormControl>
    );
};
