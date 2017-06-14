import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';
import { polyglot as polyglotPropTypes } from '../propTypes';

export const fieldIsFacetInput = ({ disabled, value, p: polyglot }) => <FieldInput
    name={polyglot.t('isFacet')}
    component={FormCheckboxField}
    labelKey="field_is_facet"
    checked={value}
    disabled={!disabled}
/>;

fieldIsFacetInput.propTypes = {
    p: polyglotPropTypes.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    value: React.PropTypes.bool.isRequired,
};

export default compose(
    translate,
)(fieldIsFacetInput);

