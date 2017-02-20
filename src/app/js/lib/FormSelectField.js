import React from 'react';
import SelectField from 'material-ui/SelectField';
import { formField as formFieldPropTypes } from '../propTypes';

const FormSelectField = ({ input, label, meta: { touched, error }, ...props }) => (
    <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
        {...props}
    />
);


FormSelectField.propTypes = formFieldPropTypes;

export default FormSelectField;
