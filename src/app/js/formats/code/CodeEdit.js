import React from 'react';
import { TextField } from '@material-ui/core';
import { formField as formFieldPropTypes } from '../../propTypes';

const CodeEdit = ({ input, label, meta: { touched, error }, ...custom }) => (
    <TextField
        placeholder={label}
        label={label}
        multiline
        rows={4}
        error={touched && !!error}
        helperText={touched && error}
        {...input}
        {...custom}
    />
);

CodeEdit.propTypes = formFieldPropTypes;

export default CodeEdit;
