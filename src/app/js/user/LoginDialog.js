import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { submit as submitAction, isSubmitting } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { login as loginAction, toggleLogin as toggleLoginAction, LOGIN_FORM_NAME } from './';
import LoginForm from './LoginForm';
import ButtonWithStatus from '../lib/ButtonWithStatus';

export const LoginDialogComponent = ({ login, p: polyglot, showModal, submit, submitting, toggleLogin }) => (
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
                onTouchTap={submit}
            />,
        ]}
        modal
        open={showModal}
        onRequestClose={toggleLogin}
    >
        <LoginForm onSubmit={login} />
    </Dialog>
);

LoginDialogComponent.propTypes = {
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

export const mapDispatchToProps = dispatch => bindActionCreators({
    login: loginAction,
    submit: () => submitAction(LOGIN_FORM_NAME),
    toggleLogin: toggleLoginAction,
}, dispatch);

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(LoginDialogComponent);
