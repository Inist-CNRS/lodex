import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import translate from 'redux-polyglot/translate';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Link } from 'react-router';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { exportPublishedDataset as exportPublishedDatasetAction } from '../../export';

const styles = {
    icon: {
        color: 'white',
    },
};

const origin = { horizontal: 'right', vertical: 'top' };

export const MenuSignedInComponent = ({ exportPublishedDataset, p: polyglot, ...props }) => (
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
            className="btn-admin"
            containerElement={<Link to="/admin" />}
            linkButton
            primaryText={polyglot.t('Admin')}
        />
        <MenuItem
            className="btn-export"
            primaryText={polyglot.t('export')}
            onClick={exportPublishedDataset}
        />
    </IconMenu>
);

MenuSignedInComponent.propTypes = {
    exportPublishedDataset: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    exportPublishedDataset: () => exportPublishedDatasetAction('csv'),
}, dispatch);

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(MenuSignedInComponent);
