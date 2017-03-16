import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import RaisedButton from 'material-ui/RaisedButton';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { signOut } from '../../user';

const styles = {
    button: {
        marginLeft: 4,
        marginRight: 4,
        marginTop: 4,
    },
};

export const SignOutButtonComponent = ({ onSignOut, p: polyglot }) => (
    <RaisedButton
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

const mapDispatchToProps = dispatch => bindActionCreators({
    onSignOut: signOut,
}, dispatch);

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(SignOutButtonComponent);
