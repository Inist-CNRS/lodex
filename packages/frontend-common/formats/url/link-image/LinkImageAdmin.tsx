import { TextField, MenuItem } from '@mui/material';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    type: 'value',
    value: '',
    maxHeight: 200,
};

interface LinkImageAdminProps {
    args?: {
        type?: string;
        value?: string;
        maxHeight?: number;
    };
    onChange(...args: unknown[]): unknown;
}

const LinkImageAdmin = ({
    args = defaultArgs,
    onChange,
}: LinkImageAdminProps) => {
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

    // @ts-expect-error TS7006
    const handleMaxHeight = (e) => {
        const maxHeight = Math.max(e.target.value, 1);
        const newArgs = { ...args, maxHeight };
        onChange(newArgs);
    };

    const { type, value, maxHeight } = args || defaultArgs;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <TextField
                    fullWidth
                    select
                    label={translate('select_a_format')}
                    onChange={handleType}
                    value={type}
                >
                    <MenuItem value="text">
                        {translate('item_other_column_content')}
                    </MenuItem>
                    <MenuItem value="column">
                        {translate('item_custom_url')}
                    </MenuItem>
                </TextField>
            </FormatDataParamsFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <TextField
                    label={
                        type !== 'text'
                            ? translate('Custom URL')
                            : translate("Column's name")
                    }
                    onChange={handleValue}
                    value={value}
                    sx={{ flexGrow: 1 }}
                />
                <TextField
                    label={translate('height_px')}
                    type="number"
                    onChange={handleMaxHeight}
                    value={maxHeight}
                    sx={{ flexGrow: 1 }}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default LinkImageAdmin;
