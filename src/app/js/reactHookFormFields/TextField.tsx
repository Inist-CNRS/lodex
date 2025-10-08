import {
    TextField as MuiTextField,
    type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { useController } from 'react-hook-form';
import { useTranslate } from '../i18n/I18NContext';

export const TextField = ({
    name,
    validate,
    label,
    required = false,
    ...props
}: MuiTextFieldProps & {
    name: string;
    validate?: (value: unknown) => string | undefined;
    label: string;
}) => {
    const { translate } = useTranslate();
    const { field, fieldState } = useController({
        name,
        rules: {
            required: required ? translate('error_field_required') : false,
            validate: (value) => {
                if (validate) {
                    return validate(value);
                }
            },
        },
    });

    return (
        <MuiTextField
            {...props}
            placeholder={`${label} *`}
            label={`${label} *`}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
        />
    );
};
