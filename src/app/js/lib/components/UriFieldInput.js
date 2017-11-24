import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import FormTextField from './FormTextField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const UriFieldInputComponent = ({ p: polyglot, input }) => (
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

UriFieldInputComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    input: PropTypes.shape({}),
};

UriFieldInputComponent.defaultProps = {
    completedField: null,
    input: null,
};

export default compose(translate)(UriFieldInputComponent);
