import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    TextField as MuiTextField,
    Tooltip,
} from '@mui/material';
// @ts-expect-error TS6133
import React, { useEffect, useMemo } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormApi, useField } from '@tanstack/react-form';

import { useTranslate } from '../../i18n/I18NContext';

export type TextFieldProps = {
    form: FormApi<any>;
    type?: string;
    name: string;
    label: string;
    helperText?: string;
    multiline?: boolean;
    required?: boolean;
    disabled?: boolean;
    sx?: object;
    initialValue?: string;
    clearable?: boolean;
};

// TextField component to use tanstack react form with material ui text field
export function TextField({
    form,
    name,
    label,
    disabled,
    helperText,
    multiline,
    required,
    type,
    sx,
    initialValue,
    clearable,
}: TextFieldProps) {
    const { translate } = useTranslate();
    const field = useField({ name, form });

    useEffect(() => {
        if (initialValue && !field.state.value) {
            field.handleChange(initialValue);
        }
    }, [initialValue, field]);

    const error = useMemo(() => {
        // required is used for optionally required field based on a condition
        // since tanstack form does not support multi field validation on the field side
        if (required) {
            return field.state.meta.isTouched && !field.state.value
                ? 'error_field_required'
                : null;
        }
        return field.state.meta.isTouched && field.state.meta.errors?.length
            ? field.state.meta.errors[0]
            : null;
    }, [field.state, required]);

    return (
        <FormControl fullWidth sx={sx}>
            <MuiTextField
                label={label}
                name={field.name}
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                disabled={disabled}
                type={type}
                onChange={(e) => {
                    field.handleChange(e.target.value ? e.target.value : null);
                }}
                {...(multiline
                    ? {
                          multiline: true,
                          minRows: 5,
                          maxRows: 10,
                      }
                    : {})}
                multiline={multiline}
                error={!!error}
                InputProps={{
                    endAdornment: clearable && field.state.value && (
                        <InputAdornment position="end">
                            <Tooltip title={translate('clear')}>
                                <IconButton
                                    aria-label={translate('clear')}
                                    onClick={() => {
                                        field.handleChange(null);
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ),
                }}
            />
            {error ? (
                <FormHelperText error role="alert">
                    {translate(error)}
                </FormHelperText>
            ) : (
                helperText && <FormHelperText>{helperText}</FormHelperText>
            )}
        </FormControl>
    );
}
