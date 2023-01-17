import React, { useContext } from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import colorsTheme from '../../../custom/colorsTheme';
import classNames from 'classnames';
import { SidebarContext } from './SidebarContext';

const useStyles = makeStyles({
    button: {
        color: colorsTheme.white.primary,
        transition: 'transform 0.3s ease-in-out',
    },
    menuOpen: {
        transform: 'rotate(0deg)',
    },
    menuClosed: {
        transform: 'rotate(180deg)',
    },
});

const SidebarToggleButton = ({ p: polyglot }) => {
    const classes = useStyles();
    const { open, toggleSidebar } = useContext(SidebarContext);

    return (
        <Box mr={1}>
            <Tooltip title={polyglot.t(open ? 'close_menu' : 'open_menu')}>
                <IconButton
                    className={classNames(
                        classes.button,
                        open ? classes.menuOpen : classes.menuClosed,
                        'sidebar-toggle-button',
                    )}
                    onClick={toggleSidebar}
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
