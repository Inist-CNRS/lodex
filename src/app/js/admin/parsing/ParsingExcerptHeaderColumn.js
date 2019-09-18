import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { TableHeaderColumn } from '@material-ui/core/Table';
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
        <TableHeaderColumn
            style={Object.assign(styles.col, style)}
            title={column}
        >
            {getShortText(column)}
        </TableHeaderColumn>
    ) : (
        <TableHeaderColumn style={styles.col}>{column}</TableHeaderColumn>
    );

ParsingExcerptHeaderColumnComponent.propTypes = {
    style: PropTypes.object, // eslint-disable-line
    column: PropTypes.string.isRequired,
};

ParsingExcerptHeaderColumnComponent.defaultProps = {
    style: null,
};

export default pure(ParsingExcerptHeaderColumnComponent);
