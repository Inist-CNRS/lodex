import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import memoize from 'lodash.memoize';
import { formField as formFieldPropTypes } from '../../propTypes';

const isChecked = memoize((value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    return value.toString().toLowerCase() === 'true';
});

const FormCheckboxField = ({ input, label, meta, ...custom }) => (
    <Checkbox
        label={label}
        checked={isChecked(input.value)}
        onCheck={input.onChange}
        {...custom}
    />
);

FormCheckboxField.propTypes = formFieldPropTypes;

export default FormCheckboxField;
