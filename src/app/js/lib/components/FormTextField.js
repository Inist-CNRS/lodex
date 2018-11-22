import React from 'react';
import TextField from 'material-ui/TextField';
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
        hintText={label}
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        value={input.value === null ? '' : input.value}
        {...custom}
    />
);

FormTextField.propTypes = formFieldPropTypes;

export default FormTextField;
