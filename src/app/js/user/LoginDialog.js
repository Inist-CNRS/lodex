import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { submit, isSubmitting } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import { login as loginAction, toggleLogin as toggleLoginAction, LOGIN_FORM_NAME } from './';
import LoginForm from './LoginForm';
import ButtonWithStatus from '../lib/ButtonWithStatus';

class LoginDialog extends Component {
    handleSubmit = (values) => {
        this.props.login(values);
    }

    handleSubmitButtonClick = () => {
        this.props.submit(LOGIN_FORM_NAME);
    }

    render() {
        const { showModal, submitting, toggleLogin, p: polyglot } = this.props;

        return (
            <Dialog
                className="dialog-login"
                title="Sign in"
                actions={[
                    <FlatButton
                        label={polyglot.t('Cancel')}
                        onTouchTap={toggleLogin}
                    />,
                    <ButtonWithStatus
                        label={polyglot.t('Sign in')}
                        loading={submitting}
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
    p: polyglotPropTypes.isRequired,
    submit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    toggleLogin: PropTypes.func.isRequired,
};

export const mapStateToProps = state => ({
    showModal: state.user.showModal,
    submitting: isSubmitting(LOGIN_FORM_NAME)(state),
});

export const mapDispatchToProps = ({
    login: loginAction,
    submit,
    toggleLogin: toggleLoginAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(LoginDialog);
