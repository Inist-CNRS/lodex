import React from 'react';

import FormatEdition from '../formats/FormatEdition';
import FieldInput from '../lib/components/FieldInput';

export default () => (<FieldInput
    name="format"
    component={FormatEdition}
    labelKey="format"
/>);
