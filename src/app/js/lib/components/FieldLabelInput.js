import React from 'react';

import FormTextField from './FormTextField';
import FieldInput from './FieldInput';

export default () => <FieldInput
    name="label"
    component={FormTextField}
    labelKey="fieldLabel"
    fullWidth
/>;
