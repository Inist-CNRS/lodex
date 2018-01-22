import React from 'react';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';

const FieldDisplayInHomeInput = () => (
    <FieldInput
        className="display_in_home"
        name="display_in_home"
        component={FormCheckboxField}
        labelKey="field_display_in_home"
    />
);

export default FieldDisplayInHomeInput;
