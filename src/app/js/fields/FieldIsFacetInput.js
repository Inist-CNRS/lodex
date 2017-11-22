import React from 'react';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';

export default () => (
    <FieldInput
        name="isFacet"
        component={FormCheckboxField}
        labelKey="field_is_facet"
    />
);
