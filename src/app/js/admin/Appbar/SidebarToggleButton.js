import React, { useContext } from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { Box, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { SidebarContext } from '../Sidebar/SidebarContext';

const SidebarToggleButton = ({ p: polyglot }) => {
    const { open, setSidebarOpen } = useContext(SidebarContext);

    return (
        <Box mr={1}>
            <Tooltip title={polyglot.t(open ? 'close_menu' : 'open_menu')}>
                <IconButton
                    sx={{
                        transition: 'transform 0.3s ease-in-out',
                        transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                    }}
                    color="contrast"
                    onClick={() => setSidebarOpen(!open)}
                >
                    <MenuIcon sx={{ fontSize: '30px' }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

SidebarToggleButton.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(SidebarToggleButton);
