import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useField } from '@tanstack/react-form';
import { useTranslate } from '../../i18n/I18NContext';

// TextField component to use tanstack react form with material ui text field
export function SelectField({
    form,
    name,
    label,
    helperText,
    required,
    options,
}) {
    const { translate } = useTranslate();
    const field = useField({ name, form });

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
    }, [field.state]);

    const value = field.state.value ?? '';

    const labelId = `select-${name}-label`;
    const testId = `select-${name}-input`;

    return (
        <FormControl fullWidth>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                label={label}
                name={field.name}
                value={value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={!!error}
                SelectDisplayProps={{
                    role: 'combobox',
                    'aria-labelledby': labelId,
                    'aria-valuetext': value,
                    'aria-valuenow': value,
                }}
                inputProps={{
                    'data-testid': testId,
                }}
            >
                <MenuItem value={''}>&nbsp;</MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
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

SelectField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ),
};
