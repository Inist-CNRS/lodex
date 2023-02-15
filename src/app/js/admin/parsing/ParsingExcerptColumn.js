import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { CircularProgress, TableCell } from '@mui/material';
import { isLongText, getShortText } from '../../lib/longTexts';

export const ParsingExcerptColumnComponent = ({
    children,
    sx,
    value,
    isEnrichmentLoading,
}) => (
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
        title={value}
    >
        {isEnrichmentLoading && value === undefined ? (
            <>
                <CircularProgress variant="indeterminate" size={20} />
            </>
        ) : (
            <>
                {isLongText(value) ? getShortText(value) : `${value}`}
                {children}
            </>
        )}
    </TableCell>
);

ParsingExcerptColumnComponent.propTypes = {
    children: PropTypes.node,
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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isEnrichmentLoading: PropTypes.bool,
};

ParsingExcerptColumnComponent.defaultProps = {
    children: null,
    style: null,
};

export default pure(ParsingExcerptColumnComponent);
