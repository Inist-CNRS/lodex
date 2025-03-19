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

export function IsContributorNamePublicField({ form }) {
    const { translate } = useTranslate();
    const field = useField({ name: 'isContributorNamePublic', form });

    const handleCheckboxChange = (event) => {
        field.handleChange(event.target.checked);
    };

    const error = useMemo(() => {
        return field.state.meta.isTouched && field.state.meta.errors?.length
            ? field.state.meta.errors[0]
            : null;
    }, [field.state]);

    return (
        <FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={field.state.value ?? false}
                        onChange={handleCheckboxChange}
                    />
                }
                label={translate('annotation.isContributorNamePublic')}
            />
            {error && (
                <FormHelperText error role="alert">
                    {translate(error)}
                </FormHelperText>
            )}
        </FormControl>
    );
}

IsContributorNamePublicField.propTypes = {
    form: PropTypes.object.isRequired,
};
