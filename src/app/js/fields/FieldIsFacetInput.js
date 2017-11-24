import React from 'react';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';

const FieldIsFacetInput = () => (
    <FieldInput
        name="isFacet"
        component={FormCheckboxField}
        labelKey="field_is_facet"
    />
);

export default FieldIsFacetInput;
