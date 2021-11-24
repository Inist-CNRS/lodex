import React from 'react';
import { IconButton, MenuItem, Menu } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import translate from 'redux-polyglot/translate';

const MenuComponent = ({ p: polyglot }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = !!anchorEl;
    const handleOpenMenu = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
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
                <MenuItem onClick={handleCloseMenu}>
                    {polyglot.t('sign_out')}
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                    {polyglot.t('export_fields')}
                </MenuItem>
            </Menu>
        </div>
    );
};

MenuComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(MenuComponent);
