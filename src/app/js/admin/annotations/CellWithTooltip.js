import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const CellWithTooltip = ({ value }) => {
    return (
        <Tooltip title={value}>
            <Typography
                sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                }}
            >
                {value}
            </Typography>
        </Tooltip>
    );
};

CellWithTooltip.propTypes = {
    value: PropTypes.string.isRequired,
};
