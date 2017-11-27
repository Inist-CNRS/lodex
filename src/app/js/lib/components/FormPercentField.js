import React from 'react';
import TextField from 'material-ui/TextField';
import { formField as formFieldPropTypes } from '../../propTypes';

const styles = {
    input: { width: '96%' },
};

const FormPercentField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
}) => (
    <TextField
        style={styles.input}
        type="number"
        min={10}
        max={100}
        step={10}
        hintText={label}
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        {...custom}
    />
);

FormPercentField.propTypes = formFieldPropTypes;

export default FormPercentField;
