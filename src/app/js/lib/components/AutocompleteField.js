import {
    Autocomplete,
    createFilterOptions,
    FormControl,
    FormHelperText,
    ListItem,
    ListItemText,
    TextField,
} from '@mui/material';
import { useField } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { useAutocompleteTranslations } from './useAutocompleteTranslations';

const filter = createFilterOptions();
function optionToAutocompleteValue(option) {
    return {
        value: option,
        title: option,
    };
}

// TextField component to use tanstack react form with material ui text field
export function AutocompleteField({
    form,
    name,
    label,
    helperText,
    required,
    options,
    freeSolo,
}) {
    const { translate } = useTranslate();
    const field = useField({ name, form });
    const autocompleteTranslations = useAutocompleteTranslations();

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
    }, [required, field.state]);

    const value = useMemo(() => {
        return optionToAutocompleteValue(field.state.value ?? '');
    }, [field.state.value]);

    const testId = `select-${name}-input`;

    const mappedOptions = useMemo(() => {
        // We need to have an empty value to avoid warnings from the Autocomplete component
        return ['', ...options].map(optionToAutocompleteValue);
    }, [options]);

    const isOptionEqualToValue = useCallback((option, value) => {
        return option.value === value.value;
    }, []);

    return (
        <FormControl fullWidth>
            <Autocomplete
                value={value}
                onBlur={field.handleBlur}
                onChange={(_, val) => {
                    field.handleChange(val?.value ?? '');
                }}
                options={mappedOptions}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name={field.name}
                        label={label}
                        data-testid={testId}
                        error={!!error}
                    />
                )}
                freeSolo={freeSolo}
                filterOptions={(options, params) => {
                    const filtered = filter(
                        options.filter(({ value }) => value !== ''),
                        params,
                    );

                    const { inputValue } = params;
                    const isExisting = options.some(
                        (option) => inputValue === option.title,
                    );
                    if (inputValue !== '' && !isExisting) {
                        filtered.push({
                            value: inputValue,
                            title: translate('autocomplete_add', {
                                option: inputValue,
                            }),
                        });
                    }

                    return filtered;
                }}
                getOptionLabel={(option) => {
                    return option.value ?? '';
                }}
                renderOption={(props, option) => {
                    return (
                        <ListItem {...props} key={option.value}>
                            <ListItemText primary={option.title} />
                        </ListItem>
                    );
                }}
                isOptionEqualToValue={isOptionEqualToValue}
                aria-label={label}
                {...autocompleteTranslations}
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

AutocompleteField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.string),
    freeSolo: PropTypes.bool,
};
