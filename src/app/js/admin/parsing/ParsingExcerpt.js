import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const ParsingExcerpt = ({ columns, lines }) => (
    <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
                {columns.map(c => <TableHeaderColumn>{c}</TableHeaderColumn>)}
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            {lines.map(l => (
                <TableRow>
                    {columns.map(c => <TableRowColumn>{l[c]}</TableRowColumn>)}
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

ParsingExcerpt.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ParsingExcerpt;
