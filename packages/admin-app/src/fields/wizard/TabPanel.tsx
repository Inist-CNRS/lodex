import React from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
    children: React.ReactNode;
    value: number;
    index: number;
}

export const TabPanel = ({
    children,
    value,
    index,
    ...other
}: TabPanelProps) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            {...other}
        >
            {value === index && <Box py={3}>{children}</Box>}
        </div>
    );
};
