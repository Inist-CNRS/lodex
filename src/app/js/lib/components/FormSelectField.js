import React from 'react';
import SelectField from 'material-ui/SelectField';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormSelectField = ({ input, label, hint, meta: { touched, error }, ...props }) => (
    <SelectField
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
