import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

// @ts-expect-error TS7031
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
