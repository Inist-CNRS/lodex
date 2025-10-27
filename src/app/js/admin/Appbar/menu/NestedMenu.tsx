import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import React from 'react';

interface NestedMenuProps {
    isOpen: boolean;
    onOpen(...args: unknown[]): unknown;
    onClose(...args: unknown[]): unknown;
    label: string;
    menu: React.ReactNode;
}

export function NestedMenu({
    isOpen,
    onOpen,
    onClose,
    label,
    menu,
}: NestedMenuProps) {
    return (
        <Box
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            sx={{
                position: 'relative',
            }}
        >
            <MenuItem
                sx={{
                    justifyContent: 'space-between',
                }}
            >
                <Box component="span" mr={1}>
                    {label}
                </Box>
                <ChevronRightIcon />
            </MenuItem>

            <Fade in={isOpen}>
                <Paper
                    elevation={8}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        transform: 'translateX(-100%)',
                    }}
                >
                    {menu}
                </Paper>
            </Fade>
        </Box>
    );
}
