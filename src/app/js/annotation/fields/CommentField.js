import { FormControl, FormHelperText, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';

export function CommentField({ form }) {
    const { translate } = useTranslate();
    return (
        <form.Field name="comment">
            {(field) => {
                const hasErrors = !!(
                    field.state.meta.isTouched &&
                    field.state.meta.errors?.length
                );

                return (
                    <FormControl fullWidth>
                        <TextField
                            label={`${translate('annotation.comment')} *`}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            minRows={5}
                            maxRows={10}
                            multiline
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

CommentField.propTypes = {
    form: PropTypes.object.isRequired,
};
