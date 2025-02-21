import PropTypes from 'prop-types';
import React from 'react';

import { Checkbox, FormControlLabel } from '@mui/material';
import { useField } from '@tanstack/react-form';
import { useTranslate } from '../../i18n/I18NContext';

export function AuthorRememberMeField({ form }) {
    const { translate } = useTranslate();
    const field = useField({ name: 'authorRememberMe', form });

    const handleCheckboxChange = (event) => {
        field.handleChange(event.target.checked);
    };

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={field.state.value}
                    onChange={handleCheckboxChange}
                />
            }
            label={translate('annotation.authorRememberMe')}
        />
    );
}

AuthorRememberMeField.propTypes = {
    form: PropTypes.object.isRequired,
};
