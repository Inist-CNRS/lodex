import React from 'react';
import { Select } from '@material-ui/core';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormSelectField = ({
    input,
    label,
    hint,
    meta: { touched, error },
    ...props
}) => (
    <Select
        floatingLabelText={label}
        hintText={hint}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
        {...props}
    />
);

FormSelectField.propTypes = formFieldPropTypes;

FormSelectField.defaultProps = {
    label: '',
};

export default FormSelectField;
