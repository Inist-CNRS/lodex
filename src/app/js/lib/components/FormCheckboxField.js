import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import memoize from 'lodash.memoize';
import { formField as formFieldPropTypes } from '../../propTypes';

const isChecked = memoize(value => {
    if (typeof value === 'boolean') {
        return value;
    }

    return value.toString().toLowerCase() === 'true';
});

const FormCheckboxField = ({ input, label, meta, ...custom }) => (
    <FormControlLabel
        control={
            <Checkbox
                checked={isChecked(input.value)}
                onChange={input.onChange}
                {...custom}
            />
        }
        label={label}
    />
);

FormCheckboxField.propTypes = formFieldPropTypes;

export default FormCheckboxField;
