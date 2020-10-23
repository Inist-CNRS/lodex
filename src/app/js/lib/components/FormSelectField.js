import React from 'react';

import {
    Select,
    FormControl,
    FormHelperText,
    InputLabel,
} from '@material-ui/core';

import { formField as formFieldPropTypes } from '../../propTypes';

const FormSelectField = ({
    input,
    label,
    hint,
    meta: { touched, error },
    ...props
}) => (
    <FormControl>
        <InputLabel>{label}</InputLabel>
        <Select
            error={touched && error}
            {...input}
            onChange={e => input.onChange(e.target.value)}
            {...props}
        />
        <FormHelperText>{hint}</FormHelperText>
    </FormControl>
);

FormSelectField.propTypes = formFieldPropTypes;

FormSelectField.defaultProps = {
    label: '',
};

export default FormSelectField;
