// @ts-expect-error TS6133
import React, { useContext } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { SidebarContext } from '../Sidebar/SidebarContext';
import { useTranslate } from '../../i18n/I18NContext';

const SidebarToggleButton = () => {
    const { translate } = useTranslate();
    const { open, setSidebarOpen } = useContext(SidebarContext);

    return (
        <Box mr={1}>
            <Tooltip title={translate(open ? 'close_menu' : 'open_menu')}>
                <IconButton
                    sx={{
                        transition: 'transform 0.3s ease-in-out',
                        transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                    }}
                    // @ts-expect-error TS2769
                    color="contrast"
                    // @ts-expect-error TS2554
                    onClick={() => setSidebarOpen(!open)}
                >
                    <MenuIcon sx={{ fontSize: '30px' }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

SidebarToggleButton.propTypes = {};

export default SidebarToggleButton;
