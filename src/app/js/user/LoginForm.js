import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';

import { LOGIN_FORM_NAME } from './reducers';
import Alert from '../lib/Alert';

const validate = values => {
    const errors = ['username', 'password'].reduce((currentErrors, field) => {
        if (!values[ field ]) {
            return {
                ...currentErrors,
                [ field ]: 'Required',
            };
        }
        return currentErrors;
    }, {});

    return errors;
}

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
    <TextField
        hintText={label}
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        {...custom}
    />
);

export const LoginForm = ({ error, handleSubmit }) => (
    <form onSubmit={handleSubmit}>
        {error && <Alert><p>{error}</p></Alert>}
        <Field name="username" component={renderTextField} label="Username" fullWidth />
        <Field name="password" type="password" component={renderTextField} label="Password" fullWidth />
    </form>
);

export default reduxForm({
    form: LOGIN_FORM_NAME,
    validate,
})(LoginForm);
