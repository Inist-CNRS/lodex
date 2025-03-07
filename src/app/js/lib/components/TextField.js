import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    TextField as MuiTextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { useField } from '@tanstack/react-form';

import { useTranslate } from '../../i18n/I18NContext';

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
}) {
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
                            <IconButton
                                aria-label={translate('clear')}
                                onClick={() => {
                                    field.handleChange(null);
                                }}
                            >
                                <ClearIcon />
                            </IconButton>
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

TextField.propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    multiline: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    sx: PropTypes.object,
    initialValue: PropTypes.string,
    clearable: PropTypes.bool,
};
