import React from 'react';
import { Switch, FormControlLabel } from '@material-ui/core';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormRadioField = ({ input, label, meta, ...custom }) => (
    <FormControlLabel
        control={
            <Switch
                checked={input.value}
                onChange={input.onChange}
                {...custom}
            />
        }
        label={label}
    />
);

FormRadioField.propTypes = formFieldPropTypes;

export default FormRadioField;
