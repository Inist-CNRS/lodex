import React from 'react';
import translate from 'redux-polyglot/translate';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';

import FormTextField from '../lib/components/FormTextField';
import FieldInput from '../lib/components/FieldInput';

export const FieldInternalNameComponent = () => (
    <FieldInput
        name="internalName"
        component={FormTextField}
        labelKey="internalName"
    />
);

FieldInternalNameComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldInternalNameComponent);
