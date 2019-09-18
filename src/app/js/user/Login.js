import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { submit as submitAction, isSubmitting } from 'redux-form';
import { Card, CardActions, CardHeader, CardText } from '@material-ui/core/Card';

import { polyglot as polyglotPropTypes } from '../propTypes';
import {
    login as loginAction,
    toggleLogin as toggleLoginAction,
    LOGIN_FORM_NAME,
} from './';
import { fromUser } from '../sharedSelectors';
import LoginForm from './LoginForm';
import ButtonWithStatus from '../lib/components/ButtonWithStatus';

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
                onClick={submit}
                primary
            />
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
    showModal: fromUser.isUserModalShown(state),
    submitting: isSubmitting(LOGIN_FORM_NAME)(state),
});

export const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            login: values => loginAction(values),
            submit: () => submitAction(LOGIN_FORM_NAME),
            toggleLogin: toggleLoginAction,
        },
        dispatch,
    );

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(LoginComponent);
