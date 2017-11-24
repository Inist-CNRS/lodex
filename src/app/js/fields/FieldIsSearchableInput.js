import React from 'react';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';

const FieldIsSearchableInput = () => (
    <FieldInput
        name="searchable"
        component={FormCheckboxField}
        labelKey="field_searchable"
    />
);

export default FieldIsSearchableInput;
