import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import FormTextField from '../lib/FormTextField';

import { polyglot as polyglotPropTypes } from '../propTypes';
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

const styles = {
    alert: {
        width: '100%',
    },
};
export const LoginFormComponent = ({ error, handleKeyPress, handleSubmit, p: polyglot }) => (
    <form id="login_form" onSubmit={handleSubmit}>
        {error && <Alert style={styles.alert}><p>{error}</p></Alert>}

        <Field
            name="username"
            component={FormTextField}
            label={polyglot.t('Username')}
            onKeyPress={handleKeyPress}
            autoFocus
            fullWidth
        />

        <Field
            name="password"
            type="password"
            component={FormTextField}
            label={polyglot.t('Password')}
            onKeyPress={handleKeyPress}
            fullWidth
        />
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
    withHandlers({
        handleKeyPress: ({ handleSubmit }) => (event) => {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        },
    }),
    translate,
)(LoginFormComponent);
