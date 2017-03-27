import React from 'react';
import RadioButton from 'material-ui/RadioButton';
import { formField as formFieldPropTypes } from '../propTypes';

const FormRadioField = ({ input, label, meta, ...custom }) => (
    <RadioButton
        label={label}
        checked={input.value}
        onCheck={input.onChange}
        {...custom}
    />
);

FormRadioField.propTypes = formFieldPropTypes;

export default FormRadioField;
