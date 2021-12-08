import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { TableCell } from '@material-ui/core';
import { isLongText, getShortText } from '../../lib/longTexts';

const styles = {
    col: {
        position: 'relative',
        minWidth: '10rem',
        overflow: 'visible',
        height: '5rem',
    },
};

export const ParsingExcerptColumnComponent = ({ children, style, value }) =>
    isLongText(value) ? (
        <TableCell style={{ ...styles.col, ...style }} title={value}>
            {getShortText(value)}
            {children}
        </TableCell>
    ) : (
        <TableCell style={{ ...styles.col, ...style }}>
            {`${value}`}
            {children}
        </TableCell>
    );

ParsingExcerptColumnComponent.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

ParsingExcerptColumnComponent.defaultProps = {
    children: null,
    style: null,
};

export default pure(ParsingExcerptColumnComponent);
