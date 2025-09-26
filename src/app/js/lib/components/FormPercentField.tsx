import React from 'react';
import { TextField } from '@mui/material';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormPercentField = ({
    // @ts-expect-error TS7031
    input,
    // @ts-expect-error TS7031
    label,
    // @ts-expect-error TS7031
    meta: { touched, error },
    ...custom
}) => (
    <TextField
        sx={{
            width: '30%',
            marginTop: 2,
        }}
        type="number"
        min={10}
        max={100}
        step={10}
        placeholder={label}
        label={label}
        error={touched && !!error}
        helperText={touched && error}
        InputProps={{
            endAdornment: '%',
        }}
        {...input}
        {...custom}
    />
);

FormPercentField.propTypes = formFieldPropTypes;

export default FormPercentField;
