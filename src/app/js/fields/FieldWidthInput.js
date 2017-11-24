import React from 'react';

import FormPercentField from '../lib/components/FormPercentField';
import FieldInput from '../lib/components/FieldInput';

const FieldWidthInput = () => (
    <div>
        <FieldInput
            className="width"
            name="width"
            component={FormPercentField}
            labelKey="field_width"
        />%
    </div>
);

export default FieldWidthInput;
