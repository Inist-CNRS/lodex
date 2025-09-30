import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

export const TabPanel = ({ children, value, index, ...other }) => {
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

TabPanel.propTypes = {
    children: PropTypes.node.isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
};
