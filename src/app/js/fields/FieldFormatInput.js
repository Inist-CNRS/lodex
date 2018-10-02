import React from 'react';

import FormatEdition from '../formats/FormatEdition';
import FieldInput from '../lib/components/FieldInput';

const FieldFormatInput = () => (
    <div id="step-value-format">
        <FieldInput name="format" component={FormatEdition} labelKey="format" />
    </div>
);

export default FieldFormatInput;
