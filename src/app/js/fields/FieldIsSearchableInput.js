import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import FormCheckboxField from '../lib/components/FormCheckboxField';
import FieldInput from '../lib/components/FieldInput';
import { polyglot as polyglotPropTypes } from '../propTypes';

export const FieldIsSearchableInput = ({ disabled, value, p: polyglot }) => <FieldInput
    name={polyglot.t('searchable')}
    component={FormCheckboxField}
    labelKey="field_searchable"
    checked={value}
    disabled={!disabled}
/>;

FieldIsSearchableInput.propTypes = {
    p: polyglotPropTypes.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    value: React.PropTypes.bool.isRequired,
};

export default compose(
    translate,
)(FieldIsSearchableInput);
