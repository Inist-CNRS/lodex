import React from 'react';

import FieldInput from '../lib/components/FieldInput';
import FormSwitchField from '../lib/components/FormSwitchField';

export default function FieldAnnotationKindAdditionInput() {
    return (
        <FieldInput
            name="enableAnnotationKindAddition"
            component={FormSwitchField}
            labelKey="field_annotation_kind_addition"
        />
    );
}

FieldAnnotationKindAdditionInput.propTypes = {};
