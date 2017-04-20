import React from 'react';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import FormCheckboxField from './FormCheckboxField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const FieldIsFacetInputComponent = ({ p: polyglot }) => (
    <Field
        name="isFacet"
        component={FormCheckboxField}
        label={polyglot.t('field_is_facet')}
    />
);

FieldIsFacetInputComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldIsFacetInputComponent);
