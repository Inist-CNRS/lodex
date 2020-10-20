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
        height: 'auto',
    },
};

export const ParsingExcerptHeaderColumnComponent = ({ style, column }) =>
    isLongText(column) ? (
        <TableCell style={{ ...styles.col, ...style }} title={column}>
            {getShortText(column)}
        </TableCell>
    ) : (
        <TableCell style={styles.col}>{column}</TableCell>
    );

ParsingExcerptHeaderColumnComponent.propTypes = {
    style: PropTypes.object,
    column: PropTypes.string.isRequired,
};

ParsingExcerptHeaderColumnComponent.defaultProps = {
    style: null,
};

export default pure(ParsingExcerptHeaderColumnComponent);
