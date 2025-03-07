import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const CellWithTooltip = ({ value }) => {
    return (
        <Typography
            title={value}
            sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            }}
        >
            {value}
        </Typography>
    );
};

CellWithTooltip.propTypes = {
    value: PropTypes.string.isRequired,
};
