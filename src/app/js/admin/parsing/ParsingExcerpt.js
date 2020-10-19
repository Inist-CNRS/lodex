import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { Table, TableBody, TableHead, TableRow } from '@material-ui/core';

import { addField } from '../../fields';
import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';
import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptHeaderColumn from './ParsingExcerptHeaderColumn';

const styles = {
    table: {
        display: 'block',
        overflowX: 'auto',
        width: 'auto',
        borderLeft: '1px solid rgb(224, 224, 224)',
    },
    body: {
        position: 'relative',
    },
};

export const getRowStyle = (index, total) => {
    let opacity = 1;

    if (total > 2 && index === total - 2) {
        opacity = 0.45;
    }

    if (total > 2 && index === total - 1) {
        opacity = 0.25;
    }

    return { opacity, height: 36 };
};

export const ParsingExcerptComponent = ({
    columns,
    handleAddColumn,
    lines,
    showAddColumns,
}) => {
    const total = lines.length;

    return (
        <Table selectable={false} fixedHeader={false} style={styles.table}>
            <TableHead displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    {columns.map(column => (
                        <ParsingExcerptHeaderColumn
                            key={`header_${column}`}
                            column={column}
                        />
                    ))}
                </TableRow>
            </TableHead>
            <TableBody style={styles.body} displayRowCheckbox={false}>
                {lines.map((line, index) => (
                    <TableRow
                        displayBorder={false}
                        key={`${line._id}_data_row`}
                        style={getRowStyle(index, total)}
                    >
                        {columns.map(column => {
                            const showAddColumnButton =
                                showAddColumns &&
                                showAddColumns &&
                                (index === total - 3 ||
                                    (total < 3 && index === 0));

                            return (
                                <ParsingExcerptColumn
                                    key={`${column}_${line._id}`}
                                    value={line[column]}
                                >
                                    {showAddColumnButton && (
                                        <ParsingExcerptAddColumn
                                            key={`add_column_${column}`}
                                            name={column}
                                            onAddColumn={handleAddColumn}
                                            atTop={total < 3}
                                        />
                                    )}
                                </ParsingExcerptColumn>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

ParsingExcerptComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    showAddColumns: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
    handleAddColumn: addField,
};

export default compose(
    connect(undefined, mapDispatchToProps),
    pure,
)(ParsingExcerptComponent);
