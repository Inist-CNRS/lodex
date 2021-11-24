import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, MenuItem, Menu } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { dumpDataset } from '../dump';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { signOut } from '../../user';
import { exportFields } from '../../exportFields';

const MenuComponent = ({
    p: polyglot,
    dumpDataset,
    onSignOut,
    exportFields,
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = !!anchorEl;
    const handleOpenMenu = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = callback => {
        setAnchorEl(null);
        callback && callback();
    };
    return (
        <div>
            {/* The more button to display menu */}
            <IconButton
                color="inherit"
                aria-label="more"
                onClick={handleOpenMenu}
            >
                <MoreVert />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => handleCloseMenu(onSignOut)}>
                    {polyglot.t('sign_out')}
                </MenuItem>
                <MenuItem onClick={() => handleCloseMenu(exportFields)}>
                    {polyglot.t('export_fields')}
                </MenuItem>
                <MenuItem onClick={() => handleCloseMenu(dumpDataset)}>
                    {polyglot.t('export_raw_dataset')}
                </MenuItem>
            </Menu>
        </div>
    );
};

MenuComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    dumpDataset: PropTypes.func.isRequired,
    onSignOut: PropTypes.func.isRequired,
    exportFields: PropTypes.func.isRequired,
};
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            onSignOut: signOut,
            dumpDataset,
            exportFields,
        },
        dispatch,
    );

export default compose(
    connect(null, mapDispatchToProps),
    translate,
)(MenuComponent);
