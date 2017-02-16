import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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
            <TableRow onCellClick={onHeaderClick}>
                {columns.map(({ label, name }) => (
                    <TableHeaderColumn
                        className={`publication-excerpt-column publication-excerpt-column-${name}`}
                        style={styles.header}
                        tooltip={polyglot.t('click_to_edit_publication_field')}
                    >
                        {label || name}
                    </TableHeaderColumn>))}
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            {lines.map(line => (
                <TableRow>
                    {columns.map(({ name }) => <TableRowColumn>{line[name]}</TableRowColumn>)}
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

PublicationExcerptComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    onHeaderClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    pure,
    withHandlers({
        onHeaderClick: ({ onHeaderClick }) => (_, __, col) => {
            if (onHeaderClick) {
                onHeaderClick(col - 1);
            }
        },
    }),
)(PublicationExcerptComponent);
