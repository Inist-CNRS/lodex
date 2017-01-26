import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { submit as submitAction, isSubmitting } from 'redux-form';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';

import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import { login as loginAction, toggleLogin as toggleLoginAction, LOGIN_FORM_NAME } from './';
import LoginForm from './LoginForm';
import ButtonWithStatus from '../lib/ButtonWithStatus';

const styles = {
    container: {
        marginTop: '0.5rem',
    },
};

export const LoginComponent = ({ login, p: polyglot, submit, submitting }) => (
    <Card style={styles.container}>
        <CardHeader title={polyglot.t('Login')} />
        <CardText>
            <LoginForm onSubmit={login} />
        </CardText>
        <CardActions>
            <ButtonWithStatus
                label={polyglot.t('Sign in')}
                loading={submitting}
                onTouchTap={submit}
            />,
        </CardActions>
    </Card>
);

LoginComponent.propTypes = {
    login: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    submit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

LoginComponent.defaultProps = {
    previousState: null,
};

export const mapStateToProps = state => ({
    showModal: state.user.showModal,
    submitting: isSubmitting(LOGIN_FORM_NAME)(state),
});

export const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
    login: values => loginAction({
        ...values,
        previousState: ownProps.location && ownProps.location.state && ownProps.location.state.nextPathname,
    }),
    submit: () => submitAction(LOGIN_FORM_NAME),
    toggleLogin: toggleLoginAction,
}, dispatch);

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(LoginComponent);

