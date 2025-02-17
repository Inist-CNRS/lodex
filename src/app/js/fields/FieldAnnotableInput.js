import React from 'react';

import FieldInput from '../lib/components/FieldInput';
import FormSwitchField from '../lib/components/FormSwitchField';

export default function FieldAnnotableInput() {
    return (
        <FieldInput
            name="annotable"
            component={FormSwitchField}
            labelKey="field_annotable"
        />
    );
}

FieldAnnotableInput.propTypes = {};
