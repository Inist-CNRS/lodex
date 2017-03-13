import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import { formField as formFieldPropTypes } from '../propTypes';

const FormCheckboxField = ({ input, label, meta, ...custom }) => (
    <Checkbox
        label={label}
        checked={input.value}
        onCheck={input.onChange}
        {...custom}
    />
);

FormCheckboxField.propTypes = formFieldPropTypes;

export default FormCheckboxField;
