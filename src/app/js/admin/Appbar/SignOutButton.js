import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Button } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { signOut } from '../../user';

const styles = {
    button: {
        color: 'white',
        padding: '0 20px',
        borderRadius: 0,
        boxSizing: 'border-box',
    },
};

export const SignOutButtonComponent = ({ onSignOut, p: polyglot }) => (
    <Button
        variant="text"
        className="btn-sign-out"
        onClick={onSignOut}
        style={styles.button}
        startIcon={<ExitToAppIcon />}
    >
        {polyglot.t('sign_out')}
    </Button>
);

SignOutButtonComponent.propTypes = {
    onSignOut: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            onSignOut: signOut,
        },
        dispatch,
    );

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(SignOutButtonComponent);
