import React from 'react';
import { TextField } from '@mui/material';
import { formField as formFieldPropTypes } from '../../propTypes';

const CodeEdit = ({ input, label, meta: { touched, error }, ...custom }) => (
    <TextField
        variant="standard"
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
