import React from 'react';
import { Switch } from '@material-ui/core';
import { formField as formFieldPropTypes } from '../../propTypes';

const FormRadioField = ({ input, label, meta, ...custom }) => (
    <Switch
        label={label}
        checked={input.value}
        onChange={input.onChange}
        {...custom}
    />
);

FormRadioField.propTypes = formFieldPropTypes;

export default FormRadioField;
