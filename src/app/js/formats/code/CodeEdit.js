import React from 'react';
import TextField from 'material-ui/TextField';
import { formField as formFieldPropTypes } from '../../propTypes';

const CodeEdit = ({ input, label, meta: { touched, error }, ...custom }) => (
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

CodeEdit.propTypes = formFieldPropTypes;

export default CodeEdit;
