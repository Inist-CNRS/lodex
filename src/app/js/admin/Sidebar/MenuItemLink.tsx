import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { NavLink } from 'react-router-dom';

// this component is not styled
// style is herited from src/app/js/admin/Sidebar/Sidebar.js

export const MenuItemLink = ({ to, primaryText, leftIcon, ...rest }) => (
    <MenuItem
        component={NavLink}
        activeClassName="active"
        to={to}
        disableGutters
        {...rest}
    >
        <ListItemIcon>{leftIcon}</ListItemIcon>
        {primaryText}
    </MenuItem>
);

MenuItemLink.propTypes = {
    to: PropTypes.string.isRequired,
    primaryText: PropTypes.string.isRequired,
    leftIcon: PropTypes.element.isRequired,
};
