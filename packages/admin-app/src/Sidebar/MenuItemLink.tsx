import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { NavLink } from 'react-router-dom';

interface MenuItemLinkProps {
    to: string;
    primaryText: string;
    leftIcon: React.ReactElement;
}

// this component is not styled
// style is herited from src/app/js/admin/Sidebar/Sidebar.js

export const MenuItemLink = ({
    to,
    primaryText,
    leftIcon,
    ...rest
}: MenuItemLinkProps) => (
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
