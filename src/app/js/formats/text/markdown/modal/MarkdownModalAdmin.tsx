import { FormatDefaultParamsFieldSet } from '../../../utils/components/field-set/FormatFieldSets';
import TextField from '@mui/material/TextField';
import FormatGroupedFieldSet from '../../../utils/components/field-set/FormatGroupedFieldSet';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useTranslate } from '../../../../i18n/I18NContext';

export const defaultArgs = {
    type: 'text',
    label: '',
    fullScreen: false,
    maxWidth: 'sm',
};

interface MarkdownModalAdminProps {
    args?: {
        type?: 'text' | 'column';
        label?: string;
        fullScreen?: boolean;
        maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    };
    onChange(...args: unknown[]): unknown;
}

const MarkdownModalAdmin = (props: MarkdownModalAdminProps) => {
    const { translate } = useTranslate();
    const { args, onChange } = props;
    // @ts-expect-error TS2339
    const { type, label, fullScreen, maxWidth } = args;

    // @ts-expect-error TS7006
    const handleType = (event) => {
        onChange({
            ...args,
            type: event.target.value,
        });
    };

    // @ts-expect-error TS7006
    const handleLabel = (event) => {
        onChange({
            ...args,
            label: event.target.value,
        });
    };

    // @ts-expect-error TS7006
    const handleFullScreen = (_, newFullScreen) => {
        onChange({
            ...args,
            fullScreen: newFullScreen,
        });
    };

    // @ts-expect-error TS7006
    const handleSize = (event) => {
        onChange({
            ...args,
            maxWidth: event.target.value,
        });
    };

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
                    <MenuItem value="text">
                        {translate('label_format_custom')}
                    </MenuItem>
                    <MenuItem value="column">
                        {translate('label_format_another_column')}
                    </MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    label={
                        type === 'text'
                            ? translate('label_format_custom_value')
                            : translate('label_format_another_column_value')
                    }
                    onChange={handleLabel}
                    value={label}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={fullScreen}
                            onChange={handleFullScreen}
                        />
                    }
                    label={translate('label_format_fullscreen')}
                />
                {!fullScreen ? (
                    <TextField
                        fullWidth
                        select
                        label={translate('label_format_size')}
                        onChange={handleSize}
                        value={maxWidth}
                    >
                        <MenuItem value="xs">xs</MenuItem>
                        <MenuItem value="sm">sm</MenuItem>
                        <MenuItem value="md">md</MenuItem>
                        <MenuItem value="lg">lg</MenuItem>
                        <MenuItem value="xl">xl</MenuItem>
                    </TextField>
                ) : null}
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

MarkdownModalAdmin.defaultProps = {
    args: defaultArgs,
};

export default MarkdownModalAdmin;
