import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import HighlightOffIcon from 'material-ui/svg-icons/action/highlight-off';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { signOut } from '../../user';

export const SignOutButtonComponent = ({ onSignOut, p: polyglot }) => (
    <IconButton
        className="btn-sign-out"
        tooltip={polyglot.t('sign_out')}
        onClick={onSignOut}
    >
        <HighlightOffIcon color="white" />
    </IconButton>
);


SignOutButtonComponent.propTypes = {
    onSignOut: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    onSignOut: signOut,
}, dispatch);

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(SignOutButtonComponent);
