import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { NavLink } from 'react-router-dom';

export const MenuItemLink = ({ to, primaryText, leftIcon }) => (
    <MenuItem
        component={NavLink}
        activeClassName="active"
        to={to}
        disableGutters
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
