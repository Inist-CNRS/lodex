// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';
import { Field } from 'redux-form';

import FormTextField from './FormTextField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

// @ts-expect-error TS7031
export const UriFieldInputComponent = ({ p: polyglot, input }) => (
    <Field
        key="uri"
        name="uri"
        component={FormTextField}
        fullWidth
        placeholder={polyglot.t('auto_generate_uri')}
        label="uri"
        variant="standard"
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

// @ts-expect-error TS2345
export default compose(translate)(UriFieldInputComponent);
