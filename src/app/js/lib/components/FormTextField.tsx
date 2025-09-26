import React from 'react';
import { TextField } from '@mui/material';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormTextField = ({
    // @ts-expect-error TS7031
    input,
    // @ts-expect-error TS7031
    label,
    // @ts-expect-error TS7031
    meta: { touched, error },
    // @ts-expect-error TS7031
    p,
    // @ts-expect-error TS7031
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
