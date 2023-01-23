import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { List, MenuItem, ListItemIcon, Collapse } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { SidebarContext } from './SidebarContext';

export const SubMenu = ({ handleToggle, isOpen, name, icon, children }) => {
    const { open: sidebarIsOpen } = useContext(SidebarContext);
    return (
        <div>
            <MenuItem onClick={handleToggle} disableGutters>
                <ListItemIcon>{isOpen ? <ExpandMore /> : icon}</ListItemIcon>
                {name}
            </MenuItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    disablePadding
                    sx={{
                        '& a': {
                            transition:
                                'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                            paddingLeft: sidebarIsOpen ? 1 : 0,
                        },
                    }}
                >
                    {children}
                </List>
            </Collapse>
        </div>
    );
};

SubMenu.propTypes = {
    handleToggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    children: PropTypes.node.isRequired,
};
