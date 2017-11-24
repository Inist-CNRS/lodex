import React from 'react';

import FormatEdition from '../formats/FormatEdition';
import FieldInput from '../lib/components/FieldInput';

const FieldFormatInput = () => (
    <FieldInput name="format" component={FormatEdition} labelKey="format" />
);

export default FieldFormatInput;
