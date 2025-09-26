import React from 'react';

import { TextField } from '@mui/material';

import { formField as formFieldPropTypes } from '../../propTypes';

const FormSelectField = ({
    input,
    label,
    hint,
    meta: { touched, error },
    ...props
}) => (
    <TextField
        select
        fullWidth
        label={label}
        helperText={hint}
        error={touched && error}
        {...input}
        onChange={(e) => input.onChange(e.target.value)}
        {...props}
    />
);

FormSelectField.propTypes = formFieldPropTypes;

FormSelectField.defaultProps = {
    label: '',
};

export default FormSelectField;
