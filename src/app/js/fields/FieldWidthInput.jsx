import React from 'react';

import FormPercentField from '../lib/components/FormPercentField';
import FieldInput from '../lib/components/FieldInput';

const FieldWidthInput = () => (
    <FieldInput
        className="width"
        name="width"
        component={FormPercentField}
        labelKey="field_width"
    />
);

export default FieldWidthInput;
