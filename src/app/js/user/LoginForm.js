import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import FormTextField from '../lib/components/FormTextField';

import { translate } from '../i18n/I18NContext';
import Alert from '../lib/components/Alert';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { LOGIN_FORM_NAME } from './';

const validate = (values, { p: polyglot }) => {
    const errors = ['username', 'password'].reduce((currentErrors, field) => {
        if (!values[field]) {
            return {
                ...currentErrors,
                [field]: polyglot.t('required'),
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
export const LoginFormComponent = ({
    error,
    handleKeyPress,
    handleSubmit,
    p: polyglot,
}) => (
    <form id="login_form" onSubmit={handleSubmit}>
        {error && (
            <Alert style={styles.alert}>
                <p>{polyglot.t(error)}</p>
            </Alert>
        )}
        <Field
            name="username"
            component={FormTextField}
            label={polyglot.t('Username')}
            onKeyPress={handleKeyPress}
            autoFocus
            fullWidth
            variant="standard"
        />
        <Field
            name="password"
            type="password"
            component={FormTextField}
            label={polyglot.t('Password')}
            onKeyPress={handleKeyPress}
            fullWidth
            variant="standard"
        />
    </form>
);

LoginFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    reduxForm({
        form: LOGIN_FORM_NAME,
        validate,
    }),
    withHandlers({
        handleKeyPress:
            ({ handleSubmit }) =>
            (event) => {
                if (event.key === 'Enter') {
                    handleSubmit();
                }
            },
    }),
)(LoginFormComponent);
