import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';

const styles = {
    table: {
        width: 'auto',
    },
    wrapper: {
        overflowX: 'auto',
    },
};

export const ParsingExcerptComponent = ({ columns, lines }) => (
    <Table selectable={false} fixedHeader={false} bodyStyle={styles.wrapper} style={styles.table}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
                {columns.map(c => <TableHeaderColumn key={`header_${c}`}>{c}</TableHeaderColumn>)}
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            {lines.map(line => (
                <TableRow key={`${line._id}_data_row`}>
                    {columns.map(c => <ParsingExcerptColumn key={`${c}_${line._id}`} value={line[c]} />)}
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
