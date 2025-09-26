import React from 'react';
import { TextField } from '@mui/material';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormTextField = ({
    input,
    label,
    meta: { touched, error },
    p,
    dispatch,
    ...custom
}) => (
    <TextField
        placeholder={label}
        label={label}
        error={touched && !!error}
        helperText={touched && error}
        {...input}
        value={input.value === null ? '' : input.value}
        {...custom}
    />
);

FormTextField.propTypes = formFieldPropTypes;

export default FormTextField;
