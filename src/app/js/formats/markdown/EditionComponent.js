import React from 'react';
import TextField from 'material-ui/TextField';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
    <TextField
        hintText={label}
        floatingLabelText={label}
        multiLine
        rows={4}
        errorText={touched && error}
        {...input}
        {...custom}
    />
);

FormTextField.propTypes = formFieldPropTypes;

export default FormTextField;
