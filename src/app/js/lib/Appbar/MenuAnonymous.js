import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { exportPublishedDataset } from '../../export';
import { toggleLogin as toggleLoginAction } from '../../user';

const styles = {
    icon: {
        color: 'white',
    },
};

const origin = { horizontal: 'right', vertical: 'top' };

export const MenuSignedInComponent = ({ onToggleLogin, onExport, p: polyglot, ...props }) => (
    <IconMenu
        {...props}
        iconStyle={styles.icon}
        iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={origin}
        anchorOrigin={origin}
    >
        <MenuItem
            className="btn-sign-in"
            primaryText={polyglot.t('Sign in')}
            onClick={onToggleLogin}
        />
        <MenuItem
            className="btn-export"
            primaryText={polyglot.t('export')}
            onClick={onExport}
        />
    </IconMenu>
);

MenuSignedInComponent.propTypes = {
    onExport: PropTypes.func.isRequired,
    onToggleLogin: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    onExport: () => exportPublishedDataset('csv'),
    onToggleLogin: toggleLoginAction,
}, dispatch);

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(MenuSignedInComponent);
