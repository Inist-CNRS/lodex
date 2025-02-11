import {
    FormControl,
    FormHelperText,
    TextField as RaTextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useTranslate } from '../../i18n/I18NContext';

// TextField component to use tanstack react form with material ui text field
export function TextField({
    form,
    name,
    label,
    helperText,
    multiline,
    required,
}) {
    const { translate } = useTranslate();
    return (
        <form.Field name={name}>
            {(field) => {
                const error = useMemo(() => {
                    // required is used for optionally required field based on a condition
                    // since tanstack form does not support multi field validation on the field side
                    if (required) {
                        return field.state.meta.isTouched && !field.state.value
                            ? 'error_field_required'
                            : null;
                    }
                    return field.state.meta.isTouched &&
                        field.state.meta.errors?.length
                        ? field.state.meta.errors[0]
                        : null;
                }, [field.state]);

                return (
                    <FormControl fullWidth>
                        <RaTextField
                            label={label}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            {...(multiline
                                ? {
                                      multiline: true,
                                      minRows: 5,
                                      maxRows: 10,
                                  }
                                : {})}
                            multiline={multiline}
                            error={!!error}
                        />
                        {error ? (
                            <FormHelperText error role="alert">
                                {translate(error)}
                            </FormHelperText>
                        ) : (
                            helperText && (
                                <FormHelperText error role="alert">
                                    {helperText}
                                </FormHelperText>
                            )
                        )}
                    </FormControl>
                );
            }}
        </form.Field>
    );
}

TextField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
    multiline: PropTypes.bool,
    required: PropTypes.bool,
};
