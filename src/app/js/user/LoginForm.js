import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';
import FormTextField from '../lib/components/FormTextField';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { LOGIN_FORM_NAME } from './';
import Alert from '../lib/components/Alert';

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
    withHandlers({
        handleKeyPress:
            ({ handleSubmit }) =>
            (event) => {
                if (event.key === 'Enter') {
                    handleSubmit();
                }
            },
    }),
    reduxForm({
        form: LOGIN_FORM_NAME,
        validate,
    }),
)(LoginFormComponent);
