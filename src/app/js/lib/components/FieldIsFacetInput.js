import React from 'react';

import FormCheckboxField from './FormCheckboxField';
import FieldInput from './FieldInput';

export default () => <FieldInput
    name="isFacet"
    component={FormCheckboxField}
    labelKey="field_is_facet"
/>;
