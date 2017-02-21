import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withProps from 'recompose/withProps';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';

const styles = {
    header: {
        cursor: 'pointer',
    },
    table: {
        width: 'auto',
    },
    cell: {
        cursor: 'pointer',
    },
};

export const PublicationExcerptComponent = ({
    areHeadersClickable,
    columns,
    lines,
    onCellClick,
    onHeaderClick,
    p: polyglot,
}) => (
    <Table selectable={false} fixedHeader={false} style={styles.table} onCellClick={onCellClick}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow onCellClick={onHeaderClick}>
                {columns.map(({ label, name }) => (
                    <TableHeaderColumn
                        key={name}
                        className={`publication-excerpt-column publication-excerpt-column-${name}`}
                        style={styles.header}
                        tooltip={areHeadersClickable ? polyglot.t('click_to_edit_publication_field') : ''}
                    >
                        {label || name}
                    </TableHeaderColumn>))}
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            {lines.map((line, index) => (
                <TableRow key={index}>
                    {columns.map(({ name }) => (
                        <TableRowColumn
                            key={`${name}_${index}`}
                            style={styles.cell}
                        >
                            {line[name]}
                        </TableRowColumn>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

PublicationExcerptComponent.propTypes = {
    areHeadersClickable: PropTypes.bool.isRequired,
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCellClick: PropTypes.func.isRequired,
    onHeaderClick: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    pure,
    withProps(({ onHeaderClick }) => ({
        areHeadersClickable: typeof onHeaderClick === 'function',
    })),
    withHandlers({
        onHeaderClick: ({ onHeaderClick }) => (_, __, col) => {
            if (onHeaderClick) {
                onHeaderClick(col - 1);
            }
        },
        onCellClick: ({ onHeaderClick }) => (_, col) => {
            if (onHeaderClick) {
                onHeaderClick(col - 1);
            }
        },
    }),
)(PublicationExcerptComponent);
