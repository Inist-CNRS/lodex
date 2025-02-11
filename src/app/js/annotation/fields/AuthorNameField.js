import { FormControl, FormHelperText, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';

export function AuthorNameField({ form }) {
    const { translate } = useTranslate();

    return (
        <form.Field name="authorName">
            {(field) => {
                const hasErrors = !!(
                    field.state.meta.isTouched &&
                    field.state.meta.errors?.length
                );

                return (
                    <FormControl fullWidth>
                        <TextField
                            label={`${translate('annotation.authorName')} *`}
                            name={field.name}
                            value={field.state.value ?? ''}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            error={hasErrors}
                        />
                        {hasErrors && (
                            <FormHelperText error role="alert">
                                {translate(field.state.meta.errors[0])}
                            </FormHelperText>
                        )}
                    </FormControl>
                );
            }}
        </form.Field>
    );
}

AuthorNameField.propTypes = {
    form: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
};
