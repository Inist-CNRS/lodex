import React from 'react';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';

const FieldDisplayInResourceInput = () => (
    <FieldInput
        className="display_in_resource"
        name="display_in_resource"
        component={FormCheckboxField}
        labelKey="field_display_in_resource"
    />
);

export default FieldDisplayInResourceInput;
