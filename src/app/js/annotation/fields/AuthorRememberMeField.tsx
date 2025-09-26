import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
} from '@mui/material';
import { useField } from '@tanstack/react-form';
import { useTranslate } from '../../i18n/I18NContext';

const formControlStyle = {
    marginTop: '0px',
};

export function AuthorRememberMeField({ form }) {
    const { translate } = useTranslate();
    const field = useField({ name: 'authorRememberMe', form });

    const handleCheckboxChange = (event) => {
        field.handleChange(event.target.checked);
    };

    const error = useMemo(() => {
        return field.state.meta.isTouched && field.state.meta.errors?.length
            ? field.state.meta.errors[0]
            : null;
    }, [field.state]);

    return (
        <FormControl style={formControlStyle}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={field.state.value ?? false}
                        onChange={handleCheckboxChange}
                    />
                }
                label={translate('annotation.authorRememberMe')}
            />
            {error && (
                <FormHelperText error role="alert">
                    {translate(error)}
                </FormHelperText>
            )}
        </FormControl>
    );
}

AuthorRememberMeField.propTypes = {
    form: PropTypes.object.isRequired,
};
