import React from 'react';
import { Field } from 'redux-form';
import translate from 'redux-polyglot/translate';

import FormTextField from './FormTextField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const FieldLabelInputComponent = ({ p: polyglot }) => (
    <Field
        name="label"
        component={FormTextField}
        label={polyglot.t('fieldLabel')}
        fullWidth
    />
);

FieldLabelInputComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldLabelInputComponent);
