import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { TableRowColumn } from '@material-ui/core/Table';
import { isLongText, getShortText } from '../../lib/longTexts';

const styles = {
    col: {
        position: 'relative',
        minWidth: '10rem',
        overflow: 'visible',
        height: 'auto',
    },
};

export const ParsingExcerptColumnComponent = ({ children, style, value }) =>
    isLongText(value) ? (
        <TableRowColumn style={Object.assign(styles.col, style)} title={value}>
            {getShortText(value)}
            {children}
        </TableRowColumn>
    ) : (
        <TableRowColumn style={styles.col}>
            {value}
            {children}
        </TableRowColumn>
    );

ParsingExcerptColumnComponent.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object, // eslint-disable-line
    value: PropTypes.string.isRequired,
};

ParsingExcerptColumnComponent.defaultProps = {
    children: null,
    style: null,
};

export default pure(ParsingExcerptColumnComponent);
