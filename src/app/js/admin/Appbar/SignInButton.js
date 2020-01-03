import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { toggleLogin as toggleLoginAction } from '../../user';

export const SignInButtonComponent = ({ onToggleLogin, p: polyglot }) => (
    <IconButton
        className="btn-sign-in"
        tooltip={polyglot.t('Sign in')}
        onClick={onToggleLogin}
    >
        <FontAwesomeIcon icon={faLock} color="white" />
    </IconButton>
);

SignInButtonComponent.propTypes = {
    onToggleLogin: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            onToggleLogin: toggleLoginAction,
        },
        dispatch,
    );

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(SignInButtonComponent);
