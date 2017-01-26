import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { submit, isSubmitting } from 'redux-form';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { locationShape } from 'react-router';

import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import { login as loginAction, toggleLogin as toggleLoginAction, LOGIN_FORM_NAME } from './';
import LoginForm from './LoginForm';
import ButtonWithStatus from '../lib/ButtonWithStatus';

const styles = {
    container: {
        marginTop: '0.5rem',
    },
};

export class LoginComponent extends Component {
    handleSubmit = (values) => {
        this.props.login({
            ...values,
            previousState: this.props.previousState,
        });
    }

    handleSubmitButtonClick = () => {
        this.props.submit(LOGIN_FORM_NAME);
    }

    render() {
        const { p: polyglot, submitting } = this.props;
        return (
            <Card style={styles.container}>
                <CardHeader title={polyglot.t('Login')} />
                <CardText>
                    <LoginForm onSubmit={this.handleSubmit} />
                </CardText>
                <CardActions>
                    <ButtonWithStatus
                        label={polyglot.t('Sign in')}
                        loading={submitting}
                        onTouchTap={this.handleSubmitButtonClick}
                    />,
                </CardActions>
            </Card>
        );
    }
}

LoginComponent.propTypes = {
    login: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    previousState: locationShape,
    submit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

LoginComponent.defaultProps = {
    previousState: null,
};

export const mapStateToProps = (state, ownProps) => ({
    showModal: state.user.showModal,
    submitting: isSubmitting(LOGIN_FORM_NAME)(state),
    previousState: ownProps.location && ownProps.location.state && ownProps.location.state.nextPathname,
});

export const mapDispatchToProps = ({
    login: loginAction,
    submit,
    toggleLogin: toggleLoginAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(LoginComponent);

