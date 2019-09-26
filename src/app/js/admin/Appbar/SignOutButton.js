import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import { Button } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { signOut } from '../../user';

const styles = {
    button: {
        color: 'white',
        marginLeft: 4,
        marginRight: 4,
    },
};

export const SignOutButtonComponent = ({ onSignOut, p: polyglot }) => (
    <Button className="btn-sign-out" onClick={onSignOut} style={styles.button}>
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
    connect(
        undefined,
        mapDispatchToProps,
    ),
    translate,
)(SignOutButtonComponent);
