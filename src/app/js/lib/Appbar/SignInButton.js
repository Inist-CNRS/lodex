import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import LockOutlineIcon from 'material-ui/svg-icons/action/lock-outline';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { toggleLogin as toggleLoginAction } from '../../user';

export const MenuSignedInComponent = ({ onToggleLogin, p: polyglot }) => (
    <IconButton
        className="btn-sign-in"
        tooltip={polyglot.t('Sign in')}
        onClick={onToggleLogin}
    >
        <LockOutlineIcon color="white" />
    </IconButton>
);


MenuSignedInComponent.propTypes = {
    onToggleLogin: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    onToggleLogin: toggleLoginAction,
}, dispatch);

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(MenuSignedInComponent);
