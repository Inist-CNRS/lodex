import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { signIn, toggleSignIn, SIGN_IN_FORM_NAME } from './reducers';
import SignInForm from './SignInForm';
import { submit, isSubmitting } from 'redux-form';

class SignInDialog extends Component {
    handleSubmit = values => {
        this.props.signIn(values);
    }

    handleSubmitButtonClick = () => {
        this.props.submit(SIGN_IN_FORM_NAME);
    }

    render() {
        const { handleSubmit, showModal, signIn, submitting, toggleSignIn } = this.props;

        return (
            <Dialog
                title="Sign in"
                actions={[
                    <FlatButton
                        label="Cancel"
                        onTouchTap={toggleSignIn}
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
                onRequestClose={toggleSignIn}
            >
                <SignInForm onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

SignInDialog.propTypes = {
    showModal: PropTypes.bool.isRequired,
    signIn: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    toggleSignIn: PropTypes.func.isRequired,
};

export const mapStateToProps = state => ({
    showModal: state.user.showModal,
    submitting: isSubmitting(SIGN_IN_FORM_NAME)(state),
});

export const mapDispatchToProps = ({
    signIn,
    submit,
    toggleSignIn,
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInDialog);
