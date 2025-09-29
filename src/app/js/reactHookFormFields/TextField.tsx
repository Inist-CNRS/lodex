import React from 'react';
import {
    TextField as MuiTextField,
    type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { useController, type Control } from 'react-hook-form';

export const TextField = ({
    name,
    validate,
    label,
    control,
    ...props
}: MuiTextFieldProps & {
    name: string;
    validate: (value: unknown) => string | undefined;
    label: string;
    control: Control<any>;
}) => {
    const { field, fieldState } = useController({
        name,
        rules: {
            validate,
        },
        control,
    });

    console.log('TextField', name, field.value, fieldState);
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
