import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const styles = {
    table: {
        width: 'auto',
    },
};

const ParsingExcerpt = ({ columns, lines, onHeaderClick }) => (
    <Table selectable={false} fixedHeader={false} style={styles.table}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow onCellClick={(_, __, col) => onHeaderClick(col - 1)}>
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

ParsingExcerpt.defaultProps = {
    onHeaderClick: () => {},
};

ParsingExcerpt.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    onHeaderClick: PropTypes.func,
};

export default ParsingExcerpt;
