import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import FormTextField from '../lib/FormTextField';

import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import { LOGIN_FORM_NAME } from './';
import Alert from '../lib/Alert';

const validate = (values) => {
    const errors = ['username', 'password'].reduce((currentErrors, field) => {
        if (!values[field]) {
            return {
                ...currentErrors,
                [field]: 'Required',
            };
        }
        return currentErrors;
    }, {});

    return errors;
};

export const LoginFormComponent = ({ error, handleSubmit, p: polyglot }) => (
    <form id="login_form" onSubmit={handleSubmit}>
        {error && <Alert><p>{error}</p></Alert>}
        <Field name="username" component={FormTextField} label={polyglot.t('Username')} fullWidth />
        <Field name="password" type="password" component={FormTextField} label={polyglot.t('Password')} fullWidth />
    </form>
);

LoginFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    reduxForm({
        form: LOGIN_FORM_NAME,
        validate,
    }),
    translate,
)(LoginFormComponent);
