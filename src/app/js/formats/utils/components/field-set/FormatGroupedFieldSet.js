import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * This element is used to group multiple FormatFieldSets in a flex box.
 * @param children {React.ReactNode}
 * @returns {JSX.Element}
 */
const FormatGroupedFieldSet = ({ children }) => {
    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            {children}
        </Box>
    );
};

FormatGroupedFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FormatGroupedFieldSet;
