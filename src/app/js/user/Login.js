import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { submit as submitAction, isSubmitting } from 'redux-form';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';

import { polyglot as polyglotPropTypes } from '../propTypes';
import {
    login as loginAction,
    toggleLogin as toggleLoginAction,
    LOGIN_FORM_NAME,
    isUserModalShown,
} from './';
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
                primary
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
    showModal: isUserModalShown(state),
    submitting: isSubmitting(LOGIN_FORM_NAME)(state),
});

export const getPreviousState = (ownProps, location) => {
    if (ownProps.location && ownProps.location.state && ownProps.location.state.nextPathname) {
        return ownProps.location.state.nextPathname;
    }

    if (location) {
        const url = new URL(location.toString());
        const pathname = url.searchParams.get('nextpathname');

        if (pathname) {
            return pathname;
        }
    }

    return 'home';
};

export const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
    login: values => loginAction({
        ...values,
        previousState: getPreviousState(ownProps, window.location),
    }),
    submit: () => submitAction(LOGIN_FORM_NAME),
    toggleLogin: toggleLoginAction,
}, dispatch);

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(LoginComponent);
