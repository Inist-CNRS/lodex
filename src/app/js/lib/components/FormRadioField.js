import React from 'react';
import { FormControlLabel, Radio } from '@material-ui/core';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormRadioField = ({ input, label, meta, ...custom }) => (
    <FormControlLabel
        label={label}
        control={
            <Radio checked={input.value} onCheck={input.onChange} {...custom} />
        }
    />
);

FormRadioField.propTypes = formFieldPropTypes;

export default FormRadioField;
