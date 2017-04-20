import React from 'react';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import FormCheckboxField from './FormCheckboxField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const FieldDisplayInResourceInputComponent = ({ p: polyglot }) => (
    <Field
        name="display_in_resource"
        component={FormCheckboxField}
        label={polyglot.t('field_display_in_resource')}
    />
);

FieldDisplayInResourceInputComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldDisplayInResourceInputComponent);
