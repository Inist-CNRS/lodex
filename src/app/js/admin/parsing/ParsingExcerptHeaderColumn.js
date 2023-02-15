import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { TableCell } from '@mui/material';
import { isLongText, getShortText } from '../../lib/longTexts';

export const ParsingExcerptHeaderColumnComponent = ({ sx, column }) => (
    <TableCell
        sx={[
            {
                position: 'relative',
                minWidth: '10rem',
                overflow: 'visible',
                height: '6rem',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        title={isLongText(column) ? column : undefined}
    >
        {isLongText(column) ? getShortText(column) : column}
    </TableCell>
);

ParsingExcerptHeaderColumnComponent.propTypes = {
    column: PropTypes.string.isRequired,
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.object,
                PropTypes.bool,
            ]),
        ),
        PropTypes.func,
        PropTypes.object,
    ]),
};

ParsingExcerptHeaderColumnComponent.defaultProps = {
    sx: null,
};

export default pure(ParsingExcerptHeaderColumnComponent);
