import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import FlatButton from '@material-ui/core/FlatButton';

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
    <FlatButton
        className="btn-sign-out"
        label={polyglot.t('sign_out')}
        onClick={onSignOut}
        style={styles.button}
    />
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

export default compose(connect(undefined, mapDispatchToProps), translate)(
    SignOutButtonComponent,
);
