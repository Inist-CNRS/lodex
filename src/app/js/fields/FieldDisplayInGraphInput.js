import React from 'react';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';

const FieldDisplayInGraphInput = () => (
    <FieldInput
        className="display_in_graph"
        name="display_in_graph"
        component={FormCheckboxField}
        labelKey="field_display_in_graph"
    />
);

export default FieldDisplayInGraphInput;
