import React from 'react';
import Radio from '@material-ui/core/Radio';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormRadioField = ({ input, label, meta, ...custom }) => (
    <Radio
        label={label}
        checked={input.value}
        onChange={input.onChange}
        {...custom}
    />
);

FormRadioField.propTypes = formFieldPropTypes;

export default FormRadioField;
