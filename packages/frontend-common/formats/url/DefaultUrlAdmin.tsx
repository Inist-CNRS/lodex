import { MenuItem, TextField } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../i18n/I18NContext';

export const defaultArgs = {
    type: 'value' as const,
    value: '',
};

interface DefaultUrlAdminProps {
    args?: {
        type?: 'value' | 'text' | 'column';
        value?: string;
    };
    onChange(...args: unknown[]): unknown;
}

const DefaultUrlAdmin = ({
    args = defaultArgs,
    onChange,
}: DefaultUrlAdminProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS7006
    const handleType = (e) => {
        const newArgs = { ...args, type: e.target.value };
        onChange(newArgs);
    };

    // @ts-expect-error TS7006
    const handleValue = (e) => {
        const newArgs = { ...args, value: e.target.value };
        onChange(newArgs);
    };

    const { type, value } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    fullWidth
                    select
                    label={translate('label_format_select_type')}
                    onChange={handleType}
                    value={type}
                >
                    <MenuItem value="value">
                        {translate('label_format_column')}
                    </MenuItem>
                    <MenuItem value="text">
                        {translate('label_format_custom')}
                    </MenuItem>
                    <MenuItem value="column">
                        {translate('label_format_another_column')}
                    </MenuItem>
                </TextField>
                {type !== 'value' && (
                    <TextField
                        fullWidth
                        label={
                            type === 'text'
                                ? translate('label_format_custom_value')
                                : translate('label_format_another_column_value')
                        }
                        onChange={handleValue}
                        value={value}
                    />
                )}
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default DefaultUrlAdmin;
