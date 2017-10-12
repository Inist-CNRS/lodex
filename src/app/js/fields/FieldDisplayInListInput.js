import React from 'react';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';

export default () => (<FieldInput
    className="display_in_list"
    name="display_in_list"
    component={FormCheckboxField}
    labelKey="field_display_in_list"
/>);
