import {
    TextField as MuiTextField,
    type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const TextField = ({
    name,
    validate,
    label,
    required = false,
    transform,
    ...props
}: MuiTextFieldProps & {
    name: string;
    validate?: (value: unknown) => string | undefined;
    label: string;
    transform?: (value: any) => string | undefined;
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

    const fieldValue =
        useMemo(() => {
            return transform ? transform(field.value) : field.value;
        }, [field.value, transform]) ?? '';

    return (
        <MuiTextField
            {...props}
            name={name}
            placeholder={label}
            label={label}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={fieldValue}
            onChange={(e) => field.onChange(e.target.value)}
            required={required}
        />
    );
};
