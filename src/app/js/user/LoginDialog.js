import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { login, toggleLogin, LOGIN_FORM_NAME } from './reducers';
import LoginForm from './LoginForm';
import { submit, isSubmitting } from 'redux-form';

class LoginDialog extends Component {
    handleSubmit = values => {
        this.props.login(values);
    }

    handleSubmitButtonClick = () => {
        this.props.submit(LOGIN_FORM_NAME);
    }

    render() {
        const { handleSubmit, showModal, login, submitting, toggleLogin } = this.props;

        return (
            <Dialog
                title="Sign in"
                actions={[
                    <FlatButton
                        label="Cancel"
                        onTouchTap={toggleLogin}
                    />,
                    <FlatButton
                        label="Sign in"
                        disabled={submitting}
                        primary
                        onTouchTap={this.handleSubmitButtonClick}
                    />,
                ]}
                modal
                open={showModal}
                onRequestClose={toggleLogin}
            >
                <LoginForm onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

LoginDialog.propTypes = {
    showModal: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    toggleLogin: PropTypes.func.isRequired,
};

export const mapStateToProps = state => ({
    showModal: state.user.showModal,
    submitting: isSubmitting(LOGIN_FORM_NAME)(state),
});

export const mapDispatchToProps = ({
    login,
    submit,
    toggleLogin,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog);
