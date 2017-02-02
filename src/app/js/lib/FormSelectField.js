import React from 'react';
import SelectField from 'material-ui/SelectField';
import { propTypes as reduxFormPropTypes } from 'redux-form';

const FormSelectField = ({ input, label, meta: { touched, error }, ...props }) => (
    <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
        {...props}
    />
);

FormSelectField.propTypes = reduxFormPropTypes;

export default FormSelectField;
