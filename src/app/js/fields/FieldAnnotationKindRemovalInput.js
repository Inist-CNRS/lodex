import React from 'react';

import FieldInput from '../lib/components/FieldInput';
import FormSwitchField from '../lib/components/FormSwitchField';

export default function FieldAnnotationKindRemovalInput() {
    return (
        <FieldInput
            name="enableAnnotationKindRemoval"
            component={FormSwitchField}
            labelKey="field_annotation_kind_removal"
        />
    );
}

FieldAnnotationKindRemovalInput.propTypes = {};
