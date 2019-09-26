import React from 'react';
import {
    FormControl,
    InputLabel,
    FormHelperText,
    Select,
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
            {...input}
            onChange={(event, index, value) => input.onChange(value)}
            {...props}
        />
        <FormHelperText>{touched && error}</FormHelperText>
    </FormControl>
);

FormSelectField.propTypes = formFieldPropTypes;

FormSelectField.defaultProps = {
    label: '',
};

export default FormSelectField;
