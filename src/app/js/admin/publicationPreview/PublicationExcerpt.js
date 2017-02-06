import React, { PropTypes } from 'react';
import translate from 'redux-polyglot/translate';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { polyglot as polyglotPropTypes } from '../../lib/propTypes';

const styles = {
    header: {
        cursor: 'pointer',
    },
    table: {
        width: 'auto',
    },
};

export const PublicationExcerptComponent = ({ columns, lines, onHeaderClick, p: polyglot }) => (
    <Table selectable={false} fixedHeader={false} style={styles.table}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow onCellClick={(_, __, col) => onHeaderClick(col - 1)}>
                {columns.map(column => (
                    <TableHeaderColumn
                        style={styles.header}
                        tooltip={polyglot.t('click_to_edit_publication_field')}
                    >
                        {column.label || column.name}
                    </TableHeaderColumn>))}
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            {lines.map(line => (
                <TableRow>
                    {columns.map(column => <TableRowColumn>{line[column.name]}</TableRowColumn>)}
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

PublicationExcerptComponent.defaultProps = {
    onHeaderClick: () => {},
};

PublicationExcerptComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    onHeaderClick: PropTypes.func,
    p: polyglotPropTypes.isRequired,
};

export default translate(PublicationExcerptComponent);
