import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
// @ts-expect-error TS7016
import memoize from 'lodash/memoize';
import { formField as formFieldPropTypes } from '../../propTypes';

// @ts-expect-error TS7006
const isChecked = memoize((value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    return value.toString().toLowerCase() === 'true';
});

// @ts-expect-error TS7031
const FormSwitchField = ({ input, label, meta, ...custom }) => (
    <FormControlLabel
        control={
            <Switch
                sx={{ marginLeft: 2 }}
                checked={isChecked(input.value)}
                onChange={input.onChange}
                {...custom}
            />
        }
        label={label}
    />
);

FormSwitchField.propTypes = formFieldPropTypes;

export default FormSwitchField;
