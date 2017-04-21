import React from 'react';

import FormCheckboxField from './FormCheckboxField';
import FieldInput from './FieldInput';

export default () => <FieldInput
    className="display_in_list"
    name="display_in_list"
    component={FormCheckboxField}
    labelKey="field_display_in_list"
/>;
