import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';

const styles = {
    table: {
        width: 'auto',
    },
};

export const ParsingExcerptComponent = ({ columns, lines }) => (
    <Table selectable={false} fixedHeader={false} style={styles.table}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
                {columns.map(c => <TableHeaderColumn key={`header_${c}`}>{c}</TableHeaderColumn>)}
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            {lines.map((l, index) => (
                <TableRow key={index}>
                    {columns.map(c => <TableRowColumn key={`${c}_${index}`}>{l[c]}</TableRowColumn>)}
                </TableRow>
            ))}
            <TableRow>
                {columns.map(c => (
                    <ParsingExcerptAddColumn key={`add_column_${c}`} name={c} />
                ))}
            </TableRow>
        </TableBody>
    </Table>
);

ParsingExcerptComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default compose(
    pure,
)(ParsingExcerptComponent);
