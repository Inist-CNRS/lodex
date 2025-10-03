// @ts-expect-error TS6133
import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import memoize from 'lodash/memoize';
import { formField as formFieldPropTypes } from '../../propTypes';

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
