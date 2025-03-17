import React from 'react';

import FieldInput from '../lib/components/FieldInput';
import FormSwitchField from '../lib/components/FormSwitchField';

export default function FieldAnnotationKindCorrectionInput() {
    return (
        <FieldInput
            name="enableAnnotationKindCorrection"
            component={FormSwitchField}
            labelKey="field_annotation_kind_correction"
        />
    );
}

FieldAnnotationKindCorrectionInput.propTypes = {};
