import React from 'react';
import TextField from 'material-ui/TextField';
import { propTypes as reduxFormPropTypes } from 'redux-form';

const FormTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
    <TextField
        hintText={label}
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        {...custom}
    />
);

FormTextField.propTypes = reduxFormPropTypes;

export default FormTextField;
