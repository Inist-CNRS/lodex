import React from 'react';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import FormCheckboxField from './FormCheckboxField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const FieldIsSearchableInputInputComponent = ({ p: polyglot }) => (
    <Field
        name="searchable"
        component={FormCheckboxField}
        label={polyglot.t('field_searchable')}
    />
);

FieldIsSearchableInputInputComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldIsSearchableInputInputComponent);
