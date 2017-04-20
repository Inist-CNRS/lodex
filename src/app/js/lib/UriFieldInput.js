import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import FormTextField from './FormTextField';
import {
    polyglot as polyglotPropTypes,
} from '../propTypes';

export const FieldInputComponent = ({ p: polyglot, input }) => (
    <Field
        key="uri"
        name="uri"
        component={FormTextField}
        floatingLabelText="uri"
        floatingLabelFixed
        fullWidth
        hintText={polyglot.t('auto_generate_uri')}
        {...input}
    />
);

FieldInputComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    input: PropTypes.shape({}),
};

FieldInputComponent.defaultProps = {
    completedField: null,
    input: null,
};

export default compose(
    translate,
)(FieldInputComponent);
