import React from 'react';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';

const FieldDisplayInput = () => (
    <FieldInput
        className="display"
        name="display"
        component={FormCheckboxField}
        labelKey="field_display"
    />
);

export default FieldDisplayInput;
