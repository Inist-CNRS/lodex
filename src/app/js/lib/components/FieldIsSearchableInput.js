import React from 'react';

import FormCheckboxField from './FormCheckboxField';
import FieldInput from './FieldInput';

export default () => <FieldInput
    name="searchable"
    component={FormCheckboxField}
    labelKey="field_searchable"
/>;
