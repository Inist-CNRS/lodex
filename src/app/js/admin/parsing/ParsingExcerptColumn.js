import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import { TableRowColumn } from 'material-ui/Table';
import { isLongText, getShortText } from '../../lib/longTexts';

export const ParsingExcerptColumnComponent = ({ value }) => (
    isLongText(value)
    ? (
        <TableRowColumn title={value}>
            {getShortText(value)}
        </TableRowColumn>
    )
    : <TableRowColumn>{value}</TableRowColumn>
);

ParsingExcerptColumnComponent.propTypes = {
    value: PropTypes.string.isRequired,
};

export default pure(ParsingExcerptColumnComponent);
