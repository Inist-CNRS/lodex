import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/action/lock-open';

import { polyglot as polyglotPropTypes } from '../../propTypes';

export const AdminButtonComponent = ({ p: polyglot }) => (
    <a href="/admin"><MoreVertIcon color="white" />
        <IconButton tooltip={polyglot.t('Admin')} />
    </a>
);

AdminButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(AdminButtonComponent);
