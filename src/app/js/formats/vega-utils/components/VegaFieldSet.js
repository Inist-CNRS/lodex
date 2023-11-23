import React from 'react';
import { vegaAdminStyle } from '../adminStyles';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const VegaFieldSet = ({ children, title }) => {
    return (
        <fieldset style={vegaAdminStyle.fieldset}>
            <legend style={vegaAdminStyle.legend}>{title}</legend>
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
                style={vegaAdminStyle.box}
            >
                {children}
            </Box>
        </fieldset>
    );
};

VegaFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
};

export default VegaFieldSet;
