// @ts-expect-error TS6133
import React from 'react';
import { TextField } from '@mui/material';
import { formField as formFieldPropTypes } from '../../../propTypes';

// @ts-expect-error TS7031
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

export default CodeEdit;
