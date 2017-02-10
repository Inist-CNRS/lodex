import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';

const styles = {
    table: {
        width: 'auto',
    },
};

export const ParsingExcerptComponent = ({ columns, lines, onAddColumn, onHeaderClick }) => (
    <Table selectable={false} fixedHeader={false} style={styles.table}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow onCellClick={onHeaderClick}>
                {columns.map(c => <TableHeaderColumn>{c}</TableHeaderColumn>)}
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            {lines.map(l => (
                <TableRow>
                    {columns.map(c => <TableRowColumn>{l[c]}</TableRowColumn>)}
                </TableRow>
            ))}
            <TableRow>
                {columns.map(c => (
                    <ParsingExcerptAddColumn name={c} onAddColumn={onAddColumn} />
                ))}
            </TableRow>
        </TableBody>
    </Table>
);

ParsingExcerptComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAddColumn: PropTypes.func.isRequired,
    onHeaderClick: PropTypes.func.isRequired,
};

export default compose(
    pure,
    withHandlers({
        onAddColumn: ({ onAddColumn }) => (name) => {
            if (onAddColumn) {
                onAddColumn(name);
            }
        },
        onHeaderClick: ({ onHeaderClick }) => (_, __, col) => {
            if (onHeaderClick) {
                onHeaderClick(col - 1);
            }
        },
    }),
)(ParsingExcerptComponent);
