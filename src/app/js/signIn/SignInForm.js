import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';

import { SIGN_IN_FORM_NAME } from './reducers';

const validate = values => {
    const errors = ['email', 'password'].reduce((currentErrors, field) => {
        if (!values[ field ]) {
            return {
                ...currentErrors,
                [ field ]: 'Required',
            };
        }
        return currentErrors;
    }, {});

    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

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

const SignInForm = ({ handleSubmit }) => (
    <form onSubmit={handleSubmit}>
        <Field name="email" component={renderTextField} label="Email" fullWidth />
        <Field name="password" type="password" component={renderTextField} label="Password" fullWidth />
    </form>
);

export default reduxForm({
    form: SIGN_IN_FORM_NAME,
    validate,
})(SignInForm);
