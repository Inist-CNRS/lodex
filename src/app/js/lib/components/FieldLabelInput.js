import React, { PropTypes } from 'react';

import FormTextField from './FormTextField';
import FieldInput from './FieldInput';

export const FieldLabelInputComponent = ({ validate }) => <FieldInput
    name="label"
    component={FormTextField}
    labelKey="fieldLabel"
    fullWidth
    validate={validate}
/>;

FieldLabelInputComponent.propTypes = {
    validate: PropTypes.arrayOf(PropTypes.func),
};

FieldLabelInputComponent.defaultProps = {
    validate: null,
};

export default FieldLabelInputComponent;
