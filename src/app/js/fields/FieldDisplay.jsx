import React from 'react';

import FormSwitchField from '../lib/components/FormSwitchField';
import FieldInput from '../lib/components/FieldInput';

const FieldDisplayInput = () => (
    <FieldInput
        className="display"
        name="display"
        component={FormSwitchField}
        labelKey="field_display"
    />
);

export default FieldDisplayInput;
