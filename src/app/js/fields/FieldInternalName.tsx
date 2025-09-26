// @ts-expect-error TS6133
import React from 'react';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';

import FormTextField from '../lib/components/FormTextField';
import FieldInput from '../lib/components/FieldInput';
import { translate } from '../i18n/I18NContext';

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
